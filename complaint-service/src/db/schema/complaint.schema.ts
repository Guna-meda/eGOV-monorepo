import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  doublePrecision,
} from 'drizzle-orm/pg-core';

export const complaints = pgTable('complaints', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalTitle: varchar('original_title', { length: 255 }).notNull(),
  translatedTitle: varchar('translated_title', { length: 255 }),
  description: text('description').notNull(),
  originalLanguage: varchar('original_language', { length: 50 }),
  translatedText: text('translated_text'),
  frequency: integer('frequency').default(1).notNull(),
  incidentOccurredAt: timestamp('incident_occurred_at'),
  
  categoryId: uuid('category_id'),
  subcategoryId: uuid('subcategory_id'),
  customCategory: varchar('custom_category', { length: 255 }),
  customSubcategory: varchar('custom_subcategory', { length: 255 }),
  userId: uuid('user_id').notNull(),
  
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  wardId: uuid('ward_id'),

  classificationCategory: varchar('classification_category', { length: 100 }),
  severity: varchar('severity', { length: 50 }),
  sentiment: varchar('sentiment', { length: 50 }),

  status: varchar('status', { length: 50 }).default('Submitted').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const complaintMedia = pgTable('complaint_media', {
  id: uuid('id').defaultRandom().primaryKey(),

  complaintId: uuid('complaint_id')
    .references(() => complaints.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  fileUrl: text('file_url').notNull(),

  fileType: varchar('file_type', {
    length: 50,
  }).notNull(),

  providerFileId: varchar(
    'provider_file_id',
    {
      length: 255,
    }
  ),

  uploadedAt: timestamp('uploaded_at')
    .defaultNow()
    .notNull(),
});