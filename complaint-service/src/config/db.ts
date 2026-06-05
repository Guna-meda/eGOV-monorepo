import { Pool } from "pg";
import logger from "../utils/logger.js";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.connect()
  .then((client: any) => {
    logger.info("PostgreSQL connected");
    client.release();
  })
  .catch((error: any) => {
    logger.error("PostgreSQL connection failed", error);
  });

export default pool;