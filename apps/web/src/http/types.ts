export interface BaseError {
  code: string;
  message: string;
  fields?: Record<string, string>;
  issues?: Record<string, string[]>;
}

export interface APISuccessResponse<T> {
  success: true;
  data: T;
}

export interface APIErrorResponse {
  success: false;
  data: null;
  message: string;
  error: BaseError;
}

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

export function createSuccessResponse<T>(data: T): APISuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

export function createErrorResponse(error: BaseError): APIErrorResponse {
  return {
    success: false,
    data: null,
    message: error.message,
    error,
  };
}

export const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
