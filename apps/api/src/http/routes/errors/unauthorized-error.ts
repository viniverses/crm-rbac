import { HttpError } from './http-error';

export class UnauthorizedError extends HttpError {
  readonly statusCode = 401;

  constructor(message?: string) {
    super(message ?? 'Unauthorized.');
  }
}
