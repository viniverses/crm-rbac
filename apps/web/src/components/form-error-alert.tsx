import { AlertTriangle } from 'lucide-react';

import { FormState } from '@/hooks/use-hybrid-form';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface FormErrorAlertProps {
  state: FormState;
  title: string;
  description?: string;
}

export function FormErrorAlert({ state, title, description }: FormErrorAlertProps) {
  return (
    <>
      {!state.success && state.message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>{title}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
        </Alert>
      )}
    </>
  );
}
