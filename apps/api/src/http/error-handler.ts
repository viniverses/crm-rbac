import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from 'fastify-type-provider-zod';

import { BadRequestError } from './routes/errors/bad-request-error';
import { NotFoundError } from './routes/errors/not-found-error';
import { UnauthorizedError } from './routes/errors/unauthorized-error';

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

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      message: error.message,
    });
  }

  console.error(error);

  // TODO: Add sentry error tracking

  return reply.status(500).send({ message: 'Internal server error' });
};
