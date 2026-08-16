import { Stack, TextField } from "@mui/material";

interface DescriptionStepProps {
  title: string;
  description: string;
  disabled?: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function DescriptionStep({
  title,
  description,
  disabled = false,
  onTitleChange,
  onDescriptionChange,
}: DescriptionStepProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
      }}
    >
      <TextField
        label="Title"
        placeholder="Brief summary of the issue"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        disabled={disabled}
        required
        fullWidth
        autoFocus
        size="small"
      />

      <TextField
        label="Description"
        placeholder="Describe the issue in detail..."
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={disabled}
        required
        fullWidth
        multiline
        minRows={7}
        maxRows={12}
        size="small"
        sx={{
          "& .MuiInputBase-root": {
            alignItems: "flex-start",
          },
        }}
      />
    </Stack>
  );
}