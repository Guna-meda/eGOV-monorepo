export interface MediaDto {
  fileUrl: string;
  fileType: string;
  providerFileId: string;
}

export interface CreateComplaintDto {
  originalTitle: string;
  description: string;
  userId: string;        
  latitude?: number;
  longitude?: number;
  media?: MediaDto[]; // Added to accept nested media items

  // Filled in from the ML service response before submitting
  category?: string;
  subcategory?: string;
  sentiment?: string;
  riskScore?: number;
  riskLabel?: string;
  mlStatus?: string;
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

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}