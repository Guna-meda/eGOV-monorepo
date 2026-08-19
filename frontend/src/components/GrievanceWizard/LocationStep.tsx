import { useState } from "react";
import {
  Alert,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface Location {
  lat: number;
  lng: number;
}

interface LocationStepProps {
  location: Location | null;
  disabled?: boolean;
  onLocationChange: (location: Location) => void;
}

export default function LocationStep({
  location,
  disabled = false,
  onLocationChange,
}: LocationStepProps) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState("");

  function handleShareLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setError("");
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });

        setLoadingLocation(false);
      },
      () => {
        setError("Unable to retrieve your location.");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Button
        variant={location ? "contained" : "outlined"}
        startIcon={<LocationOnIcon />}
        onClick={handleShareLocation}
        disabled={disabled || loadingLocation}
        size="large"
      >
        {loadingLocation
          ? "Fetching location..."
          : location
          ? "Update Location"
          : "Use Current Location"}
      </Button>

      {location && (
        <Alert severity="success">
          <Typography variant="body2">
            Location captured successfully.
          </Typography>

          <Typography variant="caption" display="block">
            Latitude: {location.lat.toFixed(6)}
          </Typography>

          <Typography variant="caption" display="block">
            Longitude: {location.lng.toFixed(6)}
          </Typography>
        </Alert>
      )}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
    </Stack>
  );
}