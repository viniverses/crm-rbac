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

export type APIErrorResponse = {
  message: string;
  error: BaseError;
  success: false;
};

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
    message: error.message,
    error,
  };
}
