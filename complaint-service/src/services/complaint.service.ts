import * as complaintRepository from '../repositories/complaint.repository.ts';
import { ApiError } from '../utils/ApiError.ts';
import { CreateComplaintDto, Bounds } from '../types/complaint.types.ts';
import logger from '../utils/logger.ts';


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
    complaintRepository
  ).createComplaint(data);

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

export const getComplaintsInBounds = async (bounds:Bounds)=>{
  console.log('Bounds received in complaint service', bounds)
  if(!bounds.north || !bounds.south || !bounds.east || !bounds.west) throw new ApiError(400,'Bounds not existing!');
  const complaints = await complaintRepository.getComplaintsInBounds(bounds);
  
  console.log('Complaints!')
  return complaints;
}