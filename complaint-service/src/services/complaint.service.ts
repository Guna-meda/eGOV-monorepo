import * as complaintRepository from '../repositories/complaint.repository.ts';
import { ApiError } from '../utils/ApiError.ts';
import { CreateComplaintDto } from '../types/complaint.types.ts';
import logger from '../utils/logger.ts';
import { complaintQueue } from '../queues/complaint.queue.ts';

export const createComplaint = async (data: CreateComplaintDto) => {
  // Check for originalTitle instead of title
  if (!data.originalTitle?.trim()) {
    throw new ApiError(
      400,
      'Title is required'
    );
  }

  if (!data.description?.trim()) {
    throw new ApiError(
      400,
      'Description is required'
    );
  }

  const complaint = await (
    complaintRepository as any
  ).createComplaint(data);

  await complaintQueue.add(
  'classify-complaint',
  {
    complaintId: complaint.id,
  }
);

  logger.info(
    `Complaint created: ${complaint.id}`
  );

  return complaint;
};

export const getAllComplaints = async () => {
  return await complaintRepository.getAllComplaints();
};

export const getComplaintById = async (id: string) => {
  const complaint = await complaintRepository.getComplaintById(id);

  if (!complaint) {
    throw new ApiError(404, 'Complaint not found');
  }

  return complaint;
};