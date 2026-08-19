import { useEffect, useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

export interface PhotoState {
  file: File;
  preview: string;
}

interface PhotosStepProps {
  photos: PhotoState[];
  disabled?: boolean;
  onPhotosChange: (photos: PhotoState[]) => void;
}

export default function PhotosStep({
  photos,
  disabled = false,
  onPhotosChange,
}: PhotosStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      photos.forEach((photo) =>
        URL.revokeObjectURL(photo.preview)
      );
    };
  }, []);

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    const newPhotos: PhotoState[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    onPhotosChange([...photos, ...newPhotos]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removePhoto(index: number) {
    URL.revokeObjectURL(photos[index].preview);

    onPhotosChange(
      photos.filter((_, i) => i !== index)
    );
  }

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Button
        component="label"
        variant="outlined"
        size="large"
        startIcon={<CloudUploadIcon />}
        disabled={disabled}
      >
        {photos.length === 0
          ? "Add Photos"
          : `Add More Photos (${photos.length})`}

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
        />
      </Button>

      {photos.length > 0 && (
        <ImageList
          cols={2}
          gap={8}
          sx={{
            m: 0,
          }}
        >
          {photos.map((photo, index) => (
            <ImageListItem
              key={`${photo.file.name}-${index}`}
              sx={{
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={photo.preview}
                alt={photo.file.name}
                sx={{
                  width: "100%",
                  aspectRatio: "1",
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />

              <IconButton
                size="small"
                type="button"
                onClick={() => removePhoto(index)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "background.paper",
                  "&:hover": {
                    bgcolor: "background.paper",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Stack>
  );
}