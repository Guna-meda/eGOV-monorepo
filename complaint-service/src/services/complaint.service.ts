import * as complaintRepository from '../repositories/complaint.repository.js';
import { ApiError, logger } from '@egov/shared';
import type { CreateComplaintDto, Bounds, Complaint } from '@egov/shared';

const fetchSeverity = async (complaint: Complaint) => {
  try {
    const response = await fetch(`${process.env.ML_SERVICE_URL}/severity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaint_id: complaint.id,
        description: complaint.description,
        category: complaint.category ?? 'Unknown',
        subcategory: complaint.subcategory ?? 'Unknown',
        ward: complaint.ward?.city ?? 'Unknown',
        sla_hours: complaint.slaHours ?? 0,
        status: complaint.status,
        escalation_level: complaint.escalationLevel ?? 0,
      }),
    });

    if (!response.ok) {
      logger.error(`Severity call failed for ${complaint.id}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    return {
      severityScore: data.severity_score,
      severityLabel: data.severity_label,
    };
  } catch (err) {
    logger.error(`Severity call errored for ${complaint.id}: ${err}`);
    return null;
  }
};

export const createComplaint = async (data: CreateComplaintDto) => {
  if (!data.originalTitle?.trim()) {
    throw new ApiError(400, 'Title is required');
  }

  if (!data.description?.trim()) {
    throw new ApiError(400, 'Description is required');
  }

  // category/subcategory/etc as part of `data` — nothing to enqueue here anymore.
  const complaint = await complaintRepository.createComplaint(data);

  // Compute severity asynchronously without blocking the response.
  void (async () => {
    const severity = await fetchSeverity(complaint as Complaint);

    if (severity) {
      await complaintRepository.updateSeverity(complaint.id, severity);
    }
  })();

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


export const getComplaintsInBounds = async (bounds:Bounds)=>{
  console.log('Bounds received in complaint service', bounds)
  if(!bounds.north || !bounds.south || !bounds.east || !bounds.west) throw new ApiError(400,'Bounds not existing!');
  const complaints = await complaintRepository.getComplaintsInBounds(bounds);
  
  console.log('Complaints!')
  return complaints;
}