export interface ApiErrorShape {
  success: false;
  message: string;
  errors?: unknown[];
}

export interface ApiResponseShape<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}