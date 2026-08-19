import {
  Card,
  CardContent,
  Divider,
  ImageList,
  ImageListItem,
  Stack,
  Typography,
} from "@mui/material";

import {
  getCategory,
  getSubcategories,
} from "../../types/categoryData" //lol put this in shared packages if this works

import type { PhotoState } from "./PhotosStep";

interface Location {
  lat: number;
  lng: number;
}

interface ReviewStepProps {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  location: Location | null;
  photos: PhotoState[];
}

export default function ReviewStep({
  title,
  description,
  category,
  subcategory,
  location,
  photos,
}: ReviewStepProps) {
  const categoryData = getCategory(category);

  const subcategoryName =
    getSubcategories(category).find(
      (sub) => sub.id === subcategory
    )?.name ?? "-";

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            Title
          </Typography>

          <Typography>
            {title}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            Description
          </Typography>

          <Typography
            sx={{
              whiteSpace: "pre-wrap",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            Category
          </Typography>

          <Typography>
            {categoryData?.name ?? "-"}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            Subcategory
          </Typography>

          <Typography>
            {subcategoryName}
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            Location
          </Typography>

          {location ? (
            <>
              <Typography>
                Latitude: {location.lat.toFixed(6)}
              </Typography>

              <Typography>
                Longitude: {location.lng.toFixed(6)}
              </Typography>
            </>
          ) : (
            <Typography color="text.secondary">
              No location selected
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            Photos
          </Typography>

          {photos.length === 0 ? (
            <Typography color="text.secondary">
              No photos attached
            </Typography>
          ) : (
            <ImageList
              cols={2}
              gap={8}
              sx={{ m: 0 }}
            >
              {photos.map((photo, index) => (
                <ImageListItem
                  key={`${photo.file.name}-${index}`}
                >
                  <img
                    src={photo.preview}
                    alt={photo.file.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}