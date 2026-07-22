import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import {
  getCategories,
  getSubcategories,
} from "../../types/categoryData";

import type { AnalyzeResponse } from "@egov/shared";

interface CategoryStepProps {
  category: string;
  subcategory: string;
  disabled?: boolean;
  prediction: AnalyzeResponse | null;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

export default function CategoryStep({
  category,
  subcategory,
  disabled = false,
  prediction,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryStepProps) {
  const categories = getCategories();
  const subcategories = getSubcategories(category);

  const predictedCategory = prediction?.predicted_category ?? "";

  const predictedSubcategory =
    prediction?.suggested_service_codes[0]?.serviceCode ?? "";

  const categoryMatches =
    !!category && category === predictedCategory;

  const categoryMismatch =
    !!prediction && !!category && !categoryMatches;

  const subcategoryMatches =
    !!subcategory && subcategory === predictedSubcategory;

  const subcategoryMismatch =
    categoryMatches &&
    !!subcategory &&
    !subcategoryMatches;

  function handleCategoryChange(value: string) {
    onCategoryChange(value);
    onSubcategoryChange("");
  }
  console.log("current subcategories:", subcategories.map(s => s.id));
  console.log("suggested codes:", prediction?.suggested_service_codes.map(s => s.serviceCode));
  return (
    <Stack spacing={3}>

      {/* Category */}

      <Box>
        <Typography
          variant="subtitle1"
          sx={{ mb: 1 , fontWeight: 600}}
        >
          Category
        </Typography>

        <FormControl fullWidth size="small">
          <Select
            displayEmpty
            value={category}
            disabled={disabled}
            onChange={(e) =>
              handleCategoryChange(e.target.value)
            }
          >
            <MenuItem value="">
              Select a category
            </MenuItem>

            {categories.map((category) => (
              <MenuItem
                key={category.id}
                value={category.id}
              >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* AI Recommendation */}
      {/* AI Recommendation / Category Warning */}

      {prediction && !category && (
        <>
          <Card
            variant="outlined"
            sx={{
              borderStyle: "dashed",
              borderRadius: 2,
            }}
          >
            <CardActionArea
              onClick={() =>
                handleCategoryChange(predictedCategory)
              }
            >
              <Stack spacing={1.5} sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <AutoAwesomeRoundedIcon
                      color="primary"
                      fontSize="small"
                    />

                    <Typography sx={{ fontWeight: 600 }}>
                      AI Recommendation
                    </Typography>
                  </Stack>

                </Stack>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Based on your description, we recommend:
                </Typography>

                <Chip
                  label={predictedCategory}
                  sx={{
                    alignSelf: "flex-start",
                  }}
                />
              </Stack>
            </CardActionArea>
          </Card>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Tap to select this category
          </Typography>
        </>
      )}

      {categoryMismatch && (
        <Card
          variant="outlined"
          sx={{
            borderColor: "warning.main",
            backgroundColor: "warning.50",
          }}
        >
          <Stack spacing={1} sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              color="warning.main"
              sx={{ fontWeight: 600 }}
            >
              Category may not match
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Based on your complaint description, this appears
              more consistent with{" "}
              <strong>{predictedCategory}</strong> than{" "}
              <strong>{category}</strong>. You can continue if
              your selection is intentional.
            </Typography>
          </Stack>
        </Card>
      )}

      <Divider />

      {/* Subcategory */}

      <Box>
        <Typography
          variant="subtitle1"
          sx={{ mb: 1 , fontWeight: 600}}
        >
          Subcategory
        </Typography>

        <FormControl
          fullWidth
          size="small"
          disabled={!category || disabled}
        >
          <Select
            displayEmpty
            value={subcategory}
            onChange={(e) =>
              onSubcategoryChange(
                e.target.value
              )
            }
          >
            <MenuItem value="">
              Select a subcategory
            </MenuItem>
            {subcategories.map(
              (subcategory) => (
                <MenuItem
                  key={subcategory.id}
                  value={subcategory.id}
                >
                  {subcategory.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Box>
      
      {/* AI Suggested Subcategories */}

      {prediction && categoryMatches && !subcategory && (
        <Stack spacing={1.5}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600 }}
          >
            AI Suggested Subcategories
          </Typography>

          {prediction.suggested_service_codes.map((service) => (
            <Card
              key={service.serviceCode}
              variant="outlined"
            >
              <CardActionArea
                onClick={() =>
                  onSubcategoryChange(service.serviceCode)
                }
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    p: 2,
                    alignItems: "center",
                  }}
                >
                  <AutoAwesomeRoundedIcon
                    color="primary"
                    fontSize="small"
                  />

                  <Typography sx={{ flexGrow: 1 }}>
                    {service.name}
                  </Typography>
                </Stack>
              </CardActionArea>
            </Card>
          ))}

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Tap a suggestion to select
          </Typography>
        </Stack>
      )}

      {/* Subcategory Warning */}

      {subcategoryMismatch && (
        <Card
          variant="outlined"
          sx={{
            borderColor: "warning.main",
            backgroundColor: "warning.50",
          }}
        >
          <Stack spacing={1} sx={{ p: 2 }}>
            <Typography
              variant="subtitle2"
              color="warning.main"
              sx={{ fontWeight: 600 }}
            >
              Subcategory may not match
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Based on your complaint description, this appears
              more consistent with{" "}
              <strong>
                {prediction?.suggested_service_codes[0]?.name}
              </strong>
              . You can continue if your selection is intentional.
            </Typography>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}