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

const STEPS = [
  "Description",
  "Category",
  "Location",
  "Photos",
  "Review",
];

const FIXED_USER_ID =
  "550e8400-e29b-41d4-a716-446655440000";

  
export default function GrievanceForm() {
  const [submitted, setSubmitted] = useState(false);
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

  function next() {
    setStep((s) =>
      Math.min(s + 1, STEPS.length - 1)
    );
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
      <Stack spacing={3}>
        {actionData?.message && (
          <Alert
            severity={actionData.ok ? "success" : "error"}
          >
            {actionData.message}
          </Alert>
        )}

      <Stepper activeStep={step} alternativeLabel>
        {STEPS.map((_, index) => (
          <Step key={index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>

      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
      >
        Step {step + 1} of {STEPS.length}
      </Typography>

      <Typography
        variant="h6"
        align="center"
        sx={{fontWeight: 600}}
      >
        {STEPS[step]}
      </Typography>
        <Box
          sx={{
            minHeight: 350,
          }}
        >
          {renderStep()}
        </Box>

        <Stack
          direction="row"
          sx={{justifyContent: "space-between"}}
          spacing={2}
        >
          <Button
            type="button"
            variant="outlined"
            disabled={step === 0 || isSubmitting}
            onClick={back}
          >
            Back
          </Button>

          {step === STEPS.length - 1 ? (
            <Button
              type="button"
              variant="contained"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Complaint"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="contained"
              disabled={
                !canContinue || isSubmitting
              }
              onClick={next}
            >
              Next
            </Button>
          )}
        </Stack>
      </Stack>
    </Form>
  );
}