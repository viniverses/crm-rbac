'use client';

import { ErrorMessage } from '@/components/error-message';

export default function NotFound() {
  return (
    <ErrorMessage
      title="Organização não encontrada"
      message="Ops... parece que a organização que você está procurando não existe."
    />
  );
}
