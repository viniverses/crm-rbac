import { HttpError } from './http-error';

export class NotFoundError extends HttpError {
  readonly statusCode = 404;

  constructor(message?: string) {
    super(message ?? 'Resource not found.');
  }
}
