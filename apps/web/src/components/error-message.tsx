import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({ title = 'Erro', message }: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
