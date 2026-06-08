import * as complaintRepository from '../repositories/complaint.repository.ts';
import { ApiError } from '../utils/ApiError.ts';
import { CreateComplaintDto } from '../types/complaint.types.ts';
import logger from '../utils/logger.ts';

export const createComplaint = async (data: CreateComplaintDto) => {
  // 1. Validate based on aligned DTO keys
  if (!data.originalTitle?.trim()) {
    throw new ApiError(400, 'Original title is required');
  }

  if (!data.description?.trim()) {
    throw new ApiError(400, 'Description is required');
  }

  if (!data.userId?.trim()) {
    throw new ApiError(400, 'User ID is required');
  }

  // 2. Interact with repository (no 'any' casts needed now)
  const complaint = await complaintRepository.createComplaint(data);

  logger.info(`Complaint created: ${complaint.id}`);

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