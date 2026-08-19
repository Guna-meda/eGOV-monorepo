// utils
export { ApiError } from './utils/ApiError.js';
export { ApiResponse } from './utils/ApiResponse.js';
export { asyncHandler } from './utils/asyncHandler.js';
export { default as logger } from './utils/logger.js';

// middlewares
export { errorHandler } from './middlewares/error.middleware.js';

// types
export type { ApiErrorShape, ApiResponseShape } from './types/api.types.js';
export type {
  MediaDto,
  CreateComplaintDto,
  MlAnalysisDto,
  UpdateComplaintStatusDto,
  ComplaintStatus,
  Bounds,
  Complaint,
  Ward,
  WardProperties,
  WardAnalyticsResponse,
  ServiceAnalytics,
  AnalyzeResponse
} from './types/complaint.types.js';

// db
export { db, default as pool } from './db/index.js';
export * from './db/schema/index.js';
