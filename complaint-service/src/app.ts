import express from 'express';
import cors from 'cors';

import { errorHandler } from './middlewares/error.middleware.js';
import complaintRoutes from './routes/complaint.routes.ts';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: '16kb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  })
);

app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'UP',
  });
});

app.use(
  '/api/v1/complaints',
  complaintRoutes
);

app.use(errorHandler);

export default app;