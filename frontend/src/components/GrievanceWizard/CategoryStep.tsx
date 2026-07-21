import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

import {
  getCategories,
  getSubcategories,
} from "../../types/categoryData"

interface CategoryStepProps {
  category: string;
  subcategory: string;
  disabled?: boolean;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

export default function CategoryStep({
  category,
  subcategory,
  disabled = false,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryStepProps) {
  const categories = getCategories();
  const subcategories = getSubcategories(category);

  function handleCategoryChange(value: string) {
    onCategoryChange(value);

    // Reset subcategory whenever category changes
    onSubcategoryChange("");
  }

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <FormControl fullWidth size="small">
        <InputLabel id="category-label">
          Category
        </InputLabel>

        <Select
          labelId="category-label"
          label="Category"
          value={category}
          disabled={disabled}
          onChange={(e) =>
            handleCategoryChange(e.target.value)
          }
        >
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

      <FormControl
        fullWidth
        size="small"
        disabled={!category || disabled}
      >
        <InputLabel id="subcategory-label">
          Subcategory
        </InputLabel>

        <Select
          labelId="subcategory-label"
          label="Subcategory"
          value={subcategory}
          onChange={(e) =>
            onSubcategoryChange(e.target.value)
          }
        >
          {subcategories.map((subcategory) => (
            <MenuItem
              key={subcategory.id}
              value={subcategory.id}
            >
              {subcategory.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}