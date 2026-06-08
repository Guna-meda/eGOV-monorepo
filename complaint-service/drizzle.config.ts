import "dotenv/config";
import { defineConfig } from "drizzle-kit";

declare const process: {
  env: Record<string, string | undefined>;
};

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/complaint.schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});