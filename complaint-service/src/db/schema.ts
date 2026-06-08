import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const complaints = pgTable("complaints", {
  id: uuid("id").defaultRandom().primaryKey(),

  originalTitle: varchar("original_title", {
    length: 255,
  }).notNull(),

  description: text("description").notNull(),

 userId: uuid("user_id").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});