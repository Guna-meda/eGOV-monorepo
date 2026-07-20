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

  // Supplied by the frontend, which calls the ML service directly
  // before submitting the complaint.
  category?: string;
  subcategory?: string;
  sentiment?: string;
  riskScore?: number;
  riskLabel?: string;
  mlStatus?: string;
}

export interface MlAnalysisDto {
  category: string;
  subcategory: string;
  sentiment: string;

  severityScore: number;
  severityLabel: string;

  riskScore: number;
  riskLabel: string;

  mlStatus: string;
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
export interface Complaint {
  id: string;
  originalTitle: string;
  translatedTitle: string | null;
  description: string;

  originalLanguage: string | null;
  translatedText: string | null;

  frequency: number;
  incidentOccurredAt: string | null;

  userId: string;

  latitude: number | null;
  longitude: number | null;

  wardId: string | null;

  category: string | null;
  subcategory: string | null;

  sentiment: string | null;

  severityScore: number | null;
  severityLabel: "LOW" | "MEDIUM" | "HIGH" |"CRITICAL";

  riskScore: number | null;
  riskLabel: string | null;

  mlStatus: string;

  status: string;

  slaHours: number;
  escalationLevel: number;

  createdAt: string;
  updatedAt: string;

  ward: Ward | null;
}
export interface WardProperties {
  ward_name: string;
  ward_name_kn: string;
  Ward_Name: string;
  zone_name: string;
  Assembly: string;
  Corporation: string;
  corporation_kn: string;

  [key: string]: unknown;
}

export interface Ward {
  id: string;
  city: string | null;
  layerType: string | null;
  level: number | null;
  properties: WardProperties;
}