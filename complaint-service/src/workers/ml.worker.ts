import './env.js';
import { Worker } from 'bullmq';

import {
  getComplaintById,
  updateMlAnalysis,
  updateMlStatus,
} from '../repositories/complaint.repository.js';

const worker = new Worker(
  'complaint-processing',
  async (job) => {
    const { complaintId } = job.data;

    await updateMlStatus(complaintId, 'PROCESSING');

    const complaint = await getComplaintById(complaintId);

    if (!complaint) {
      throw new Error(`Complaint ${complaintId} not found`);
    }

    const response = await fetch(`${process.env.ML_SERVICE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaint_id: complaint.id,
        complaint_text: complaint.description,
      }),
    });

    if (!response.ok) {
      throw new Error(`ML service failed: ${response.status}`);
    }

    const data = await response.json();

    await updateMlAnalysis(complaintId, {
      category: data.category,
      subcategory: data.subcategory,
      sentiment: data.sentiment,
      severityScore: data.severity_score,
      severityLabel: data.severity_label,
      riskScore: data.risk_score,
      riskLabel: data.risk_label,
      mlStatus: 'COMPLETED',
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT ?? 6379),
    },
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job?.id} completed`);
});

worker.on('failed', async (job, err) => {
  console.error(err);
  if (job?.data?.complaintId) {
    await updateMlStatus(job.data.complaintId, 'FAILED');
  }
});
