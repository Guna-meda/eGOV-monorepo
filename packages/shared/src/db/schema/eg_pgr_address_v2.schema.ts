import {
  pgTable,
  varchar,
  jsonb,
  bigint,
  numeric,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { egPgrServiceV2 } from './eg_pgr_service_v2.schema.js';

/**
 * Mirrors DIGIT's real eg_pgr_address_v2 table exactly -- see
 * https://docs.digit.org/complaints-management/design/architecture/data-model
 *
 * Same read-only-mirror rule as eg_pgr_service_v2: no extra columns here.
 */
export const egPgrAddressV2 = pgTable(
  'eg_pgr_address_v2',
  {
    tenantid: varchar('tenantid', { length: 256 }).notNull(),
    id: varchar('id', { length: 256 }).notNull(),
    parentid: varchar('parentid', { length: 256 })
      .notNull()
      .references(() => egPgrServiceV2.id),
    doorno: varchar('doorno', { length: 128 }),
    plotno: varchar('plotno', { length: 256 }),
    buildingname: varchar('buildingname', { length: 1024 }),
    street: varchar('street', { length: 1024 }),
    landmark: varchar('landmark', { length: 1024 }),
    city: varchar('city', { length: 512 }),
    pincode: varchar('pincode', { length: 16 }),
    locality: varchar('locality', { length: 128 }).notNull(),
    district: varchar('district', { length: 256 }),
    region: varchar('region', { length: 256 }),
    state: varchar('state', { length: 256 }),
    country: varchar('country', { length: 512 }),
    latitude: numeric('latitude', { precision: 9, scale: 6 }),
    longitude: numeric('longitude', { precision: 10, scale: 7 }),
    createdby: varchar('createdby', { length: 128 }).notNull(),
    createdtime: bigint('createdtime', { mode: 'number' }).notNull(),
    lastmodifiedby: varchar('lastmodifiedby', { length: 128 }),
    lastmodifiedtime: bigint('lastmodifiedtime', { mode: 'number' }),
    additionaldetails: jsonb('additionaldetails'),
  },
  (table) => [primaryKey({ columns: [table.id] })],
);
