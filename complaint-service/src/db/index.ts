import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import logger from '../utils/logger.ts';
import * as schema from './schema/complaint.schema.ts';

// console.log({
//   DB_HOST: process.env.DB_HOST,
//   DB_PORT: process.env.DB_PORT,
//   DB_USER: process.env.DB_USER,
//   DB_PASSWORD: process.env.DB_PASSWORD,
//   DB_NAME: process.env.DB_NAME,
// });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

pool.on('connect', () => {
  logger.info('PostgreSQL connected successfully');
});

pool.on('error', (error) => {
  logger.error('PostgreSQL connection failed', error);
});

// Export the db instance for your repositories to use
export const db = drizzle(pool, { schema });
export default pool;