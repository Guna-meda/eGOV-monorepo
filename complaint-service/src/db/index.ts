import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import logger from '../utils/logger.ts';
import * as schema from './schema/complaint.schema.ts';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  logger.info('PostgreSQL connected successfully');
});

pool.on('error', (error) => {
  logger.error('PostgreSQL connection failed', error);
});

// Export the db instance for your repositories to use
export const db = drizzle(pool, { schema });
export default pool;