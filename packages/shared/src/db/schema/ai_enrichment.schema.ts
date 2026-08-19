import {
  pgTable,
  uuid,
  varchar,
  real,
  boolean,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';
import { egPgrServiceV2 } from './eg_pgr_service_v2.schema.js';

/**
 * Our own derived AI insights, kept separate from the eg_pgr_service_v2
 * mirror on purpose (see that file's docstring) -- one row per enrichment
 * run, referencing the complaint it was computed for. Multiple rows per
 * complaint are allowed (e.g. reprocessed with a newer model), which is
 * exactly why this isn't just columns bolted onto the mirror table.
 */
export const aiEnrichment = pgTable('ai_enrichment', {
  id: uuid('id').defaultRandom().primaryKey(),

  complaintId: varchar('complaint_id', { length: 64 })
    .notNull()
    .references(() => egPgrServiceV2.id),

  predictedCategory: varchar('predicted_category', { length: 256 }),
  predictedSubcategory: varchar('predicted_subcategory', { length: 256 }),
  confidence: real('confidence'),

  urgency: varchar('urgency', { length: 20 }),
  urgencySignals: jsonb('urgency_signals'),

  recurrenceScore: real('recurrence_score'),
  isHotspot: boolean('is_hotspot'),

  modelVersion: varchar('model_version', { length: 100 }),

  processedAt: timestamp('processed_at').defaultNow().notNull(),
});
