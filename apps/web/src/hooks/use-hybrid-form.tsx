import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState, useEffect } from 'react';
import { DefaultValues, FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { BaseError } from '@/http/types';

export type FormState = {
  success: boolean;
  message?: string;
  error?: BaseError;
};

type UseHybridFormProps<T extends FieldValues> = {
  schema: z.ZodType<T>;
  formRef: React.RefObject<HTMLFormElement | null>;
  serverAction: (formData: FormData) => Promise<FormState>;
  defaultValues?: DefaultValues<T>;
  initialState?: FormState;
  onSuccess?: () => Promise<void> | void;
};

type UseHybridFormReturn<T extends FieldValues> = {
  form: UseFormReturn<T>;
  formAction: (formData: FormData) => void;
  state: FormState;
  isPending: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function useHybridForm<T extends FieldValues>({
  schema,
  serverAction,
  defaultValues,
  initialState,
  onSuccess,
  formRef,
}: UseHybridFormProps<T>): UseHybridFormReturn<T> {
  const [state, formAction, isPending] = useActionState(
    async (_: FormState, data: FormData) => {
      return await serverAction(data);
    },
    initialState ?? { success: false },
  );

  const currentState = state ?? { success: false };

  useEffect(() => {
    if (currentState.success) {
      toast.success(currentState.message);
      onSuccess?.();
    } else if (currentState.error || currentState.message) {
      toast.error(currentState.message || 'An error occurred');
    }
  }, [currentState]);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(defaultValues ?? ({} as DefaultValues<T>)),
      ...(currentState?.error?.fields ?? {}),
    },
  });

  const handleSubmit = form.handleSubmit(async () => {
    startTransition(async () => {
      const data = new FormData(formRef.current!);
      await formAction(data);
    });
  });

  return {
    form,
    state: currentState,
    formAction,
    handleSubmit,
    isPending,
  };
}
