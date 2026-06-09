export interface CreateComplaintDto {
  originalTitle: string; // Aligned with database schema
  description: string;
  userId: string;        // Added so repository can read it
  latitude?: number;
  longitude?: number;
}

export interface UpdateComplaintStatusDto {
  status:
    | 'Submitted'
    | 'Under Review'
    | 'Assigned'
    | 'In Progress'
    | 'Resolved'
    | 'Rejected';
}

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';