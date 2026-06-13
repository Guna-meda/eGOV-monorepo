import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';
import gisRoutes from './routes/gis.routes.ts';

const app: Application = express();

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
  '/api/v1/gis',
  gisRoutes
);

app.use(errorHandler);
export default app;
