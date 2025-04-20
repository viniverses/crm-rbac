import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState } from 'react';
import { DefaultValues, FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export type FormState = {
  success: boolean;
  message?: string;
  fields?: Record<string, string>;
  errors?: Record<string, string[]> | null;
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
      const response = await serverAction(data);

      if (response.success && onSuccess) {
        await onSuccess();
      }

      return response;
    },
    initialState ?? { success: false },
  );

  const currentState = state ?? { success: false };

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(defaultValues ?? ({} as DefaultValues<T>)),
      ...(currentState?.fields ?? {}),
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(formRef.current!);

    form.handleSubmit(() => {
      startTransition(() => {
        formAction(data);
      });
    })(e);
  }

  return {
    form,
    state: currentState,
    formAction,
    handleSubmit,
    isPending,
  };
}
