import {
  pgTable,
  varchar,
  boolean,
  jsonb,
  bigint,
  smallint,
  primaryKey,
  unique,
} from 'drizzle-orm/pg-core';

/**
 * Mirrors DIGIT's real eg_pgr_service_v2 table exactly (column names, types,
 * lengths, and the composite primary key) -- see
 * https://docs.digit.org/complaints-management/design/architecture/data-model
 *
 * This is a READ-ONLY-FROM-CCRS mirror, populated by the GCC-to-CCRS-shape
 * loader / the Kafka consumer, not written to by any of our own citizen-facing
 * flows. Do not add non-CCRS columns here -- see ai_enrichment.schema.ts for
 * where our own derived data belongs.
 */
export const egPgrServiceV2 = pgTable(
  'eg_pgr_service_v2',
  {
    id: varchar('id', { length: 64 }),
    tenantid: varchar('tenantid', { length: 256 }).notNull(),
    servicecode: varchar('servicecode', { length: 256 }).notNull(),
    servicerequestid: varchar('servicerequestid', { length: 256 }).notNull(),
    description: varchar('description', { length: 4000 }),
    accountid: varchar('accountid', { length: 256 }),
    additionaldetails: jsonb('additionaldetails'),
    applicationstatus: varchar('applicationstatus', { length: 128 }),
    rating: smallint('rating'),
    source: varchar('source', { length: 256 }),
    createdby: varchar('createdby', { length: 256 }).notNull(),
    createdtime: bigint('createdtime', { mode: 'number' }).notNull(),
    lastmodifiedby: varchar('lastmodifiedby', { length: 256 }),
    lastmodifiedtime: bigint('lastmodifiedtime', { mode: 'number' }),
    active: boolean('active').default(true),
  },
  (table) => [
    // Real DIGIT PK is composite (tenantid, servicerequestid) -- id is a
    // separate unique column, not the primary key. Matches pk_eg_pgr_servicereq_v2.
    primaryKey({ columns: [table.tenantid, table.servicerequestid] }),
    unique('uk_eg_pgr_service_v2').on(table.id),
  ],
);
