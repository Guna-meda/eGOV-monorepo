export class ApiError extends Error {
  statusCode: number;
  errors: unknown[];
  success: false = false;

  constructor(statusCode: number, message = 'Something went wrong', errors: unknown[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}