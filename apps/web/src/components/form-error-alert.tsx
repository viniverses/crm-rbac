import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface FormErrorAlertProps {
  title: string;
  description?: string;
}

export function FormErrorAlert({ title, description }: FormErrorAlertProps) {
  return (
    <>
      <Alert variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        {description && <AlertDescription>{description}</AlertDescription>}
      </Alert>
    </>
  );
}
