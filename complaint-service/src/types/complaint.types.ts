export interface CreateComplaintDto {
  originalTitle: string;
  description: string;
  userId: string; // Required based on your schema
  originalLanguage?: string;
  latitude?: number;
  longitude?: number;
}

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export interface UpdateComplaintStatusDto {
  status: ComplaintStatus;
}