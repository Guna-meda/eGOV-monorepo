import './env.js';

import app from './app.js';
import { logger } from '@egov/shared';

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
  console.log(`Complaint Service running on port ${PORT}`);
  logger.info(`Complaint Service running on port ${PORT}`);
});
