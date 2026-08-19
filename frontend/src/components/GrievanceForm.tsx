import { useEffect, useRef, useState } from "react";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
} from "react-router";

import {
  Alert,
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import DescriptionStep from "../components/GrievanceWizard/DescriptionStep";
import CategoryStep from "../components/GrievanceWizard/CategoryStep";
import LocationStep from "../components/GrievanceWizard/LocationStep";
import PhotosStep, {
  type PhotoState,
} from "../components/GrievanceWizard/PhotosStep";
import ReviewStep from "../components/GrievanceWizard/ReviewStep";

import {analyzeComplaint} from "../api/complaintApi"
import type {AnalyzeResponse} from '@egov/shared'

type ActionData = {
  ok: boolean;
  message?: string;
};

type Location = {
  lat: number;
  lng: number;
};

type FormState = {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: Location | null;
  photos: PhotoState[];
};

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  category: "",
  subcategory: "",
  location: null,
  photos: [],
};

const STEP_TITLES = [
  "Describe Your Complaint",
  "Select Category & Subcategory",
  "Choose Location",
  "Upload Attachments",
  "Review Complaint",
];

const FIXED_USER_ID =
  "550e8400-e29b-41d4-a716-446655440000";


  
export default function GrievanceForm() {
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<AnalyzeResponse | null>(null);

  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData() as
    | ActionData
    | undefined;

  const isSubmitting =
    navigation.state === "submitting";

  const formRef = useRef<HTMLFormElement>(null);

  const [step, setStep] = useState(0);

  const [form, setForm] =
    useState<FormState>(INITIAL_FORM);

  async function analyzeDescription() {
    setAnalyzing(true);

    try {
      const predictionData = await analyzeComplaint(form.description);
      console.log(predictionData);
      setPrediction(predictionData);
    } 
    finally {
      setAnalyzing(false);
    }
  }
  function handleNewComplaint() {
    form.photos.forEach((photo) =>
      URL.revokeObjectURL(photo.preview)
    );

    setForm(INITIAL_FORM);
    setStep(0);
    setSubmitted(false);

    formRef.current?.reset();
  }
  // -----------------------
  // Reset after success
  // -----------------------

  useEffect(() => {
    if (!actionData?.ok) return;

    setSubmitted(true);
  }, [actionData?.ok]);

  // cleanup previews

  useEffect(() => {
    return () => {
      form.photos.forEach((photo) =>
        URL.revokeObjectURL(photo.preview)
      );
    };
  }, [form.photos]);

  // -----------------------
  // Navigation
  // -----------------------

  async function next() {
    if (step === 0) {
      try {
        await analyzeDescription();
      } catch (err) {
        console.error(err);
        // Continue even if analysis fails
      }
    }

    setStep((s) => Math.min(s + 1, STEP_TITLES.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  // -----------------------
  // Validation
  // -----------------------

  const canContinue = (() => {
    switch (step) {
      case 0:
        return (
          form.title.trim() !== "" &&
          form.description.trim() !== ""
        );

      case 1:
        return (
          form.category !== "" &&
          form.subcategory !== ""
        );

      case 2:
        return form.location !== null;

      case 3:
      case 4:
        return true;

      default:
        return false;
    }
  })();

  // -----------------------
  // Submit
  // -----------------------

  function handleSubmit() {
    const fd = new FormData();

    fd.append("userId", FIXED_USER_ID);
    fd.append(
      "originalTitle",
      form.title
    );
    fd.append(
      "description",
      form.description
    );

    fd.append(
      "category",
      form.category
    );

    fd.append(
      "subcategory",
      form.subcategory
    );

    if (form.location) {
      fd.append(
        "latitude",
        String(form.location.lat)
      );

      fd.append(
        "longitude",
        String(form.location.lng)
      );
    }

    form.photos.forEach((photo) =>
      fd.append(
        "images",
        photo.file,
        photo.file.name
      )
    );

    submit(fd, {
      method: "post",
      encType: "multipart/form-data",
    });
  }

  // -----------------------
  // Current Step
  // -----------------------

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <DescriptionStep
            title={form.title}
            description={form.description}
            disabled={isSubmitting}
            onTitleChange={(title) =>
              setForm((f) => ({
                ...f,
                title,
              }))
            }
            onDescriptionChange={(
              description
            ) =>
              setForm((f) => ({
                ...f,
                description,
              }))
            }
          />
        );

      case 1:
        return (
          <CategoryStep
            category={form.category}
            subcategory={form.subcategory}
            disabled={isSubmitting}
            prediction={prediction!}
            onCategoryChange={(
              category
            ) =>
              setForm((f) => ({
                ...f,
                category,
                subcategory: "",
              }))
            }
            onSubcategoryChange={(
              subcategory
            ) =>
              setForm((f) => ({
                ...f,
                subcategory,
              }))
            }
          />
        );

      case 2:
        return (
          <LocationStep
            location={form.location}
            disabled={isSubmitting}
            onLocationChange={(
              location
            ) =>
              setForm((f) => ({
                ...f,
                location,
              }))
            }
          />
        );

      case 3:
        return (
          <PhotosStep
            photos={form.photos}
            disabled={isSubmitting}
            onPhotosChange={(photos) =>
              setForm((f) => ({
                ...f,
                photos,
              }))
            }
          />
        );

      case 4:
        return (
          <ReviewStep
            title={form.title}
            description={
              form.description
            }
            category={form.category}
            subcategory={
              form.subcategory
            }
            location={form.location}
            photos={form.photos}
          />
        );

      default:
        return null;
    }
  }
  if (submitted) {
    return (
      <Stack
        spacing={4}
        sx={{
          alignItems: "center", 
          justifyContent: "center",
          minHeight: "70vh",
          px: 3,
          textAlign: "center",
        }}
      >
        <CheckCircleRoundedIcon
          color="success"
          sx={{ fontSize: 88 }}
        />

        <Stack spacing={1}>
          <Typography variant="h5" sx={{fontWeight: 600}}>
            Complaint Submitted
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Your complaint has been submitted successfully.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            We'll review it and keep you updated on its progress.
          </Typography>
        </Stack>

        <Button
          variant="contained"
          size="large"
          onClick={handleNewComplaint}
        >
          Submit Another Complaint
        </Button>
      </Stack>
    );
  }
return (
  <Form
    ref={formRef}
    method="post"
    encType="multipart/form-data"
    onSubmit={(e) => e.preventDefault()}
  >
    <Stack sx={{ minHeight: "calc(100vh - 140px)" }}>

      {/* Progress */}
      <Box
        sx={{
          px: 3,
          pt: 2,
          pb: 3,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stepper activeStep={step} alternativeLabel>
          {STEP_TITLES.map((_, index) => (
            <Step key={index}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Form Content */}
      <Box
        sx={{
          flex: 1,
          px: 3,
          py: 4,
        }}
      >
        <Stack spacing={4}>

          {actionData?.message && (
            <Alert
              severity={
                actionData.ok
                  ? "success"
                  : "error"
              }
            >
              {actionData.message}
            </Alert>
          )}

          <Stack spacing={1}>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Step {step + 1} of {STEP_TITLES.length}
            </Typography>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            {STEP_TITLES[step]}
          </Typography>
          </Stack>

          <Box
            sx={{
              minHeight: 420,
            }}
          >
            {renderStep()}
          </Box>

        </Stack>
      </Box>

      {/* Bottom Buttons */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            fullWidth
            size="large"
            variant="outlined"
            disabled={
              step === 0 ||
              isSubmitting
            }
            onClick={back}
            sx={{
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Back
          </Button>

          {step === STEP_TITLES.length - 1 ? (
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmit}
              sx={{
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Complaint"}
            </Button>
          ) : (
            <Button
              fullWidth
              size="large"
              variant="contained"
              disabled={
                !canContinue ||
                isSubmitting ||
                analyzing
              }
              onClick={next}
              sx={{
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {analyzing
                ? "Analyzing..."
                : "Next"}
            </Button>
          )}
        </Stack>
      </Box>

    </Stack>
  </Form>
)
}