import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getComplaintById } from "../api/complaintApi";
import type { Complaint } from "@egov/shared";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

interface LocationState {
  complaint?: Complaint;
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block" }}
      >
        {label}
      </Typography>
      <Typography variant="body1">
        {value ?? "-"}
      </Typography>
    </Box>
  );
}

export default function ComplaintPage() {
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  const { complaintId } = useParams<{ complaintId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();

  const locationState = state as LocationState | null;

  useEffect(() => {
    if (locationState?.complaint) {
      setComplaint(locationState.complaint);
      return;
    }

    async function populateComplaint() {
      if (!complaintId) return;
      const res = await getComplaintById(complaintId);
      setComplaint(res);
    }

    populateComplaint();
  }, [complaintId, locationState]);

  if (!complaint) {
    return <Typography>Loading...</Typography>;
  }

  const ward = complaint.ward;

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Card elevation={0} variant="outlined">
        <CardContent>

          <Typography variant="h5" sx={{fontWeight: 600}}>
            {complaint.originalTitle}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, mb: 3 }}
          >
            <Chip
              label={complaint.status}
              color="primary"
              size="small"
            />

            <Chip
              label={complaint.severityLabel ?? "Unknown"}
              color={
                complaint.severityLabel === "HIGH"
                  ? "error"
                  : complaint.severityLabel === "MEDIUM"
                  ? "warning"
                  : "success"
              }
              size="small"
            />

            <Chip
              label={complaint.mlStatus}
              variant="outlined"
              size="small"
            />
          </Stack>

          <Typography variant="body1">
            {complaint.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>
            Location
          </Typography>

          <Stack spacing={2}>
            <Field
              label="Ward"
              value={ward?.properties.ward_name}
            />

            <Field
              label="Zone"
              value={ward?.properties.zone_name}
            />

            <Field
              label="Assembly"
              value={ward?.properties.Assembly}
            />

            <Field
              label="Coordinates"
              value={`${complaint.latitude}, ${complaint.longitude}`}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>
            Classification
          </Typography>

          <Stack spacing={2}>
            <Field label="Category" value={complaint.category} />
            <Field label="Subcategory" value={complaint.subcategory} />
          </Stack>

          <Stack spacing={2}>
            <Field
                label="Created"
                value={new Date(complaint.createdAt).toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            />

            <Field
                label="Updated"
                value={new Date(complaint.updatedAt).toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            />

          </Stack>

        </CardContent>
      </Card>
    </Box>
  );
}