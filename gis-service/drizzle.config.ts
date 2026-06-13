import "dotenv/config";
import { defineConfig } from "drizzle-kit";

declare const process: {
  env: Record<string, string | undefined>;
};

export default defineConfig({
  schema: "./src/db/schema/boundary_layers.schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ["!spatial_ref_sys", "!geography_columns", "!geometry_columns", "!raster_columns", "!raster_overviews", "!complaints","!complaints_media"],
})