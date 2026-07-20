import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

interface ComplaintPopupCardProps {
  title: string;
  ward?: string;
  createdAt: string;
  status: string;
  severity: "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";
  onClick?: () => void;
}

export default function ComplaintPopupCard({
  title,
  ward,
  createdAt,
  status,
  severity,
  onClick,
}: ComplaintPopupCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 240,
        boxShadow: "none",
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          {/* Header */}
          <Stack
            spacing={1}
            sx={{direction:"row",alignItems:"flex-start", justifyContent:"space-between"}}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.3,
                flex: 1,
              }}
            >
              {title}
            </Typography>

            <Chip
              size="small"
              label={severity}
              sx={{
                fontWeight: 700,
                color: "common.white",
                bgcolor:
                  severity === "LOW"
                    ? "success.main"
                    : severity === "MEDIUM"
                    ? "warning.light"
                    : severity === "HIGH"
                    ? "warning.main"
                    : "error.main",
              }}
            />
          </Stack>

          {/* Ward */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2, alignItems:"center"}}
          >
            <LocationOnOutlinedIcon
              fontSize="small"
              color="action"
            />
            <Typography variant="body2" color="text.secondary">
              {ward ?? "Unknown ward"}
            </Typography>
          </Stack>

          {/* Date */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, alignItems:"center" }}
          >
            <CalendarTodayOutlinedIcon
              fontSize="small"
              color="action"
            />
            <Typography variant="body2" color="text.secondary">
              {new Date(createdAt).toLocaleString()}
            </Typography>
          </Stack>

          {/* Status */}
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontWeight: 600,
            }}
          >
            {status}
          </Typography>

          {/* Click To View */}
          <Stack
            spacing={0.5}
            sx={{
              mt: 2,
              color: "primary.main",
              fontWeight: 600,
              direction:"row",
            }}
          >
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Tap to view details
            </Typography>

          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}