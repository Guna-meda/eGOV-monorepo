import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",

  schema: "./src/db/schema/index.ts",

  out: "./drizzle",

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  tablesFilter: [
    "!spatial_ref_sys",
    "!geography_columns",
    "!geometry_columns",
    "!raster_columns",
    "!raster_overviews",
  ],
});