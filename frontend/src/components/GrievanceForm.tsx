import { useRef, useState, useEffect } from "react";
import { Form, useActionData, useNavigation, useSubmit } from "react-router";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { CloudUpload, Delete, LocationOn } from "@mui/icons-material";

type ActionData = {
  ok: boolean;
  message?: string;
};

type PhotoState = {
  file: File;
  preview: string;
};

const FIXED_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

export default function GrievanceForm() {
  const actionData = useActionData() as ActionData | undefined;
  const navigation = useNavigation();
  const submit = useSubmit();

  const isSubmitting = navigation.state === "submitting";

  const formRef = useRef<HTMLFormElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<PhotoState | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (actionData?.ok === true) {
      formRef.current?.reset();
      setPhoto(null);
      setLocation(null);
    }
  }, [actionData]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto({ file, preview: URL.createObjectURL(file) });
  }

  function removePhoto() {
    if (photo) URL.revokeObjectURL(photo.preview);
    setPhoto(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  }

  function handleShareLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLoadingLocation(false);
      },
      () => {
        alert("Could not get location");
        setLoadingLocation(false);
      }
    );
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (location) {
      fd.set("latitude", String(location.lat));
      fd.set("longitude", String(location.lng));
    }
    if (photo?.file) {
      //file url im sending is a File object, actually it should be url returned by cloudinary service
      fd.set("fileUrl", photo.file, photo.file.name);
      fd.set("fileType", photo.file.type);
    }
    submit(fd, { method: "post", encType: "multipart/form-data" });
  }

  return (

    <Form method="post" onSubmit={handleSubmit} ref={formRef}>
      <Stack spacing={2} sx={{flexGrow:1}}>
        <input type="hidden" name="userId" value={FIXED_USER_ID} />

        {actionData?.ok === true && (
          <Alert severity="success">Grievance submitted successfully.</Alert>
        )}

        {actionData?.ok === false && (
          <Alert severity="error">{actionData.message}</Alert>
        )}

        <TextField name="originalTitle" label="Title" required fullWidth disabled={isSubmitting} size="small" />

        <TextField name="description" label="Description" required fullWidth multiline minRows={4} disabled={isSubmitting} size="small" />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<LocationOn fontSize="small" />}
            onClick={handleShareLocation}
            disabled={loadingLocation || isSubmitting}
            color={location ? "success" : "primary"}
            sx={{ flex: 1, fontSize: "0.8rem" }}
          >
            {loadingLocation ? "Fetching..." : location ? "Location added" : "Add location"}
          </Button>

          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload fontSize="small" />}
            disabled={isSubmitting}
            color={photo ? "success" : "primary"}
            sx={{ flex: 1, fontSize: "0.8rem" }}
          >
            {photo ? "Photo added" : "Add photo"}
            <input ref={photoInputRef} type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          </Button>
        </Box>

        {photo && (
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              src={photo.preview}
              alt="preview"
              sx={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 2, display: "block" }}
            />
            <IconButton
              size="small"
              onClick={removePhoto}
              sx={{ position: "absolute", top: 6, right: 6, bgcolor: "background.paper", boxShadow: 1 }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Button type="submit" variant="contained" fullWidth disabled={isSubmitting} size="large">
          {isSubmitting ? "Submitting..." : "Submit Grievance"}
        </Button>
      </Stack>
    </Form>
  );
}