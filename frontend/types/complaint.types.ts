export interface MediaDto {
  fileUrl: string;
  fileType: string;
}

export interface CreateComplaintDto {
  originalTitle: string;
  description: string;
  userId: string;        
  latitude?: number;
  longitude?: number;
  media?: MediaDto[]; // Added to accept nested media items
}

export interface UpdateComplaintStatusDto {
  status: ComplaintStatus;
}

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';