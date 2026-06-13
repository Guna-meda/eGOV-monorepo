import express, { Request, Response, Application } from 'express';
import cors from 'cors';



const app: Application = express();
const PORT = process.env.PORT || 3000;

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

export default app;
