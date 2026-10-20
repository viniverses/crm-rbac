import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from 'fastify-type-provider-zod';

import { HttpError } from './routes/errors/http-error';

export const errorHandler = (error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      message: "Request doesn't match the schema",
      errors: error.validation,
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      message: "Response doesn't match the schema",
      errors: error.cause.issues,
    });
  }

  if (error instanceof HttpError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    });
  }

  console.error(error);

  // TODO: Add sentry error tracking

  return reply.status(500).send({ message: 'Internal server error' });
};
