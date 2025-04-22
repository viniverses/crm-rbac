import { HTTPError } from 'ky';
import { notFound } from 'next/navigation';

import { ZodValidationError } from '@/lib/zod-error-handler';

import { APIErrorResponse, createErrorResponse } from './types';

interface ErrorMessages {
  unauthorized?: string;
  notFound?: string;
  httpError?: string;
  unknownError?: string;
  validationError?: string;
}

const defaultMessages: ErrorMessages = {
  unauthorized: 'Você não possui permissão para realizar esta ação.',
  notFound: 'Ops... parece que o que você está procurando não existe.',
  httpError: 'Ocorreu um erro na requisição.',
  unknownError: 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.',
  validationError: 'Dados do formulário inválidos.',
};

export async function handleApiError(error: APIErrorResponse | unknown, messages: ErrorMessages = {}) {
  const finalMessages = { ...defaultMessages, ...messages };

  if (error instanceof ZodValidationError) {
    return createErrorResponse({
      code: 'VALIDATION_ERROR',
      message: finalMessages.validationError!,
      fields: error.fields,
      issues: error.errors,
    });
  }

  if (error instanceof HTTPError) {
    const status = error.response.status;
    const responseBody = await error.response.json();

    if (status === 401) {
      return createErrorResponse({
        code: 'UNAUTHORIZED',
        message: finalMessages.unauthorized!,
      });
    }

    if (status === 404) {
      notFound();
      return createErrorResponse({
        code: 'NOT_FOUND',
        message: finalMessages.notFound!,
      });
    }

    if (status === 400) {
      return createErrorResponse({
        code: 'BAD_REQUEST',
        message: messages.httpError || responseBody.message || finalMessages.httpError!,
      });
    }

    return createErrorResponse({
      code: 'HTTP_ERROR',
      message: finalMessages.httpError!,
    });
  }

  if (error instanceof Error) {
    return createErrorResponse({
      code: 'UNKNOWN_ERROR',
      message: error.message || finalMessages.unknownError!,
    });
  }

  return createErrorResponse({
    code: 'UNKNOWN_ERROR',
    message: finalMessages.unknownError!,
  });
}
