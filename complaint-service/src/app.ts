import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from '@egov/shared';
import { swaggerSpec } from './swagger.js';
import complaintRoutes from './routes/complaint.routes.js';
import mediaRoutes from './routes/media.routes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'UP' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/media', mediaRoutes);

app.use(errorHandler);

export default app;
