export interface MediaDto {
  fileUrl: string;
  fileType: string;
  providerFileId?: string;
}

export interface CreateComplaintDto {
  originalTitle: string;
  description: string;
  userId: string;
  latitude?: number;
  longitude?: number;
  media?: MediaDto[];
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