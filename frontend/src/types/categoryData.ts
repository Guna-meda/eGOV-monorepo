// categoryData.ts

export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export const categories: Category[] = [
  {
    id: "roads",
    name: "Roads",
    subcategories: [
      {
        id: "potholes",
        name: "Potholes",
      },
      {
        id: "road-damage",
        name: "Road Damage",
      },
      {
        id: "street-lights",
        name: "Street Lights",
      },
    ],
  },
  {
    id: "water",
    name: "Water Supply",
    subcategories: [
      {
        id: "water-leak",
        name: "Water Leakage",
      },
      {
        id: "no-water",
        name: "No Water Supply",
      },
      {
        id: "low-pressure",
        name: "Low Water Pressure",
      },
    ],
  },
  {
    id: "garbage",
    name: "Garbage",
    subcategories: [
      {
        id: "garbage-not-collected",
        name: "Garbage Not Collected",
      },
      {
        id: "overflowing-bin",
        name: "Overflowing Bin",
      },
      {
        id: "illegal-dumping",
        name: "Illegal Dumping",
      },
    ],
  },
  {
    id: "drainage",
    name: "Drainage",
    subcategories: [
      {
        id: "blocked-drain",
        name: "Blocked Drain",
      },
      {
        id: "sewage-overflow",
        name: "Sewage Overflow",
      },
      {
        id: "bad-odor",
        name: "Bad Odor",
      },
    ],
  },
  {
    id: "electricity",
    name: "Electricity",
    subcategories: [
      {
        id: "power-outage",
        name: "Power Outage",
      },
      {
        id: "damaged-pole",
        name: "Damaged Electric Pole",
      },
      {
        id: "street-light-fault",
        name: "Street Light Fault",
      },
    ],
  },
];

/**
 * Returns every category.
 * Later this can be replaced with an API call.
 */
export function getCategories(): Category[] {
  return categories;
}

/**
 * Returns a single category by id.
 */
export function getCategory(categoryId: string): Category | undefined {
  return categories.find(category => category.id === categoryId);
}

/**
 * Returns the subcategories for a category.
 */
export function getSubcategories(categoryId: string): Subcategory[] {
  return (
    categories.find(category => category.id === categoryId)?.subcategories ??
    []
  );
}