import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  doublePrecision,
  customType,
} from 'drizzle-orm/pg-core';

// Custom type for PostGIS Geography
const geography = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'geography(Point,4326)';
  },
  toDriver(value: string) {
    return value;
  },
});

export const complaints = pgTable('complaints', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalTitle: varchar('original_title', { length: 255 }).notNull(),
  translatedTitle: varchar('translated_title', { length: 255 }),
  description: text('description').notNull(),
  originalLanguage: varchar('original_language', { length: 50 }),
  translatedText: text('translated_text'),
  frequency: integer('frequency').default(1).notNull(),
  incidentOccurredAt: timestamp('incident_occurred_at'),
  
  // Foreign Keys (Assuming you have Category/Subcategory tables)
  categoryId: uuid('category_id'),
  subcategoryId: uuid('subcategory_id'),
  customCategory: varchar('custom_category', { length: 255 }),
  customSubcategory: varchar('custom_subcategory', { length: 255 }),
  userId: uuid('user_id').notNull(),
  
  // Location details
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  location: geography('location'),
  wardId: uuid('ward_id'),

  // ML Fields (From the whiteboard image)
  classificationCategory: varchar('classification_category', { length: 100 }),
  severity: varchar('severity', { length: 50 }),
  sentiment: varchar('sentiment', { length: 50 }),

  status: varchar('status', { length: 50 }).default('Submitted').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});