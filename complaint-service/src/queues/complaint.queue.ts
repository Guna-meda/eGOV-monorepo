import { Queue } from 'bullmq';

export const complaintQueue =
  new Queue(
    'complaint-processing',
    {
      connection: {
  host: process.env.REDIS_HOST ?? "localhost",
  port: Number(process.env.REDIS_PORT ?? 6379),
},
    }
  );