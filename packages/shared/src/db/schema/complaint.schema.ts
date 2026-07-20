import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  doublePrecision,
  real,
  customType
} from 'drizzle-orm/pg-core';
import { boundary_layers } from "./boundary_layers.schema.js"

const geometry = customType<{ data: string }>({
    dataType() {
        return 'geometry(Point,4326)';
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
  
  userId: uuid('user_id').notNull(),
  
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  location: geometry('location'),

  wardId: uuid("ward_id").references(() => boundary_layers.id, {
  onDelete: "set null",
  onUpdate: "cascade",
}),
category: varchar("category", {
  length: 100,
}),

subcategory: varchar(
  "subcategory",
  {
    length: 100,
  }
),

sentiment: varchar(
  "sentiment",
  {
    length: 50,
  }
),

severityScore: real(
  "severity_score"
),

severityLabel: varchar( 
  "severity_label",
  {
    length: 50,
  }
),

riskScore: real(
  "risk_score"
),

riskLabel: varchar(
  "risk_label",
  {
    length: 50,
  }
),

mlStatus: varchar(
  "ml_status",
  {
    length: 50,
  }
)
  .default("PENDING")
  .notNull(),

  status: varchar('status', { length: 50 }).default('Submitted').notNull(),

  slaHours: integer('sla_hours').default(0).notNull(),
  escalationLevel: integer('escalation_level').default(0).notNull(),

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