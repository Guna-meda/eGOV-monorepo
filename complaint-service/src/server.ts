import "./env.ts";

import app from './app.js';

import logger from './utils/logger.js';

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
  console.log(`Complaint Service running on port ${PORT}`); // Keep this for Docker logs
  logger.info(
    `Complaint Service running on port ${PORT}`
  );
});