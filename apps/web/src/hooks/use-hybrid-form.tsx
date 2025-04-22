import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState, useEffect } from 'react';
import { DefaultValues, FieldValues, useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { BaseError } from '@/http/types';

export type FormState<TData = never> = {
  success: boolean;
  message?: string;
  error?: BaseError;
  data?: TData;
};

type UseHybridFormProps<TFormValues extends FieldValues, TResponseData = never> = {
  schema: z.ZodType<TFormValues>;
  formRef?: React.RefObject<HTMLFormElement>;
  serverAction: (formData: FormData) => Promise<FormState<TResponseData>>;
  defaultValues?: DefaultValues<TFormValues>;
  initialState?: FormState<TResponseData>;
  onSuccess?: (result?: TResponseData) => Promise<void> | void;
  onError?: (error?: BaseError) => Promise<void> | void;
};

type UseHybridFormReturn<TFormValues extends FieldValues, TResponseData = never> = {
  form: UseFormReturn<TFormValues>;
  formAction: (formData: FormData) => void;
  state: FormState<TResponseData>;
  isPending: boolean;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export function useHybridForm<TFormValues extends FieldValues, TResponseData = never>({
  schema,
  serverAction,
  defaultValues,
  initialState,
  onSuccess,
  onError,
}: UseHybridFormProps<TFormValues, TResponseData>): UseHybridFormReturn<TFormValues, TResponseData> {
  const [state, formAction, isPending] = useActionState(
    async (_: FormState<TResponseData>, formData: FormData) => {
      return await serverAction(formData);
    },
    initialState ?? { success: false },
  );

  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(defaultValues ?? {}),
      ...(state?.error?.fields ?? {}),
    } as DefaultValues<TFormValues>,
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onSuccess?.(state.data);
      form.reset();
    } else if (state.error || state.message) {
      toast.error(state.message || 'An error occurred');
      onError?.(state.error);
    }
  }, [state]);

  const handleSubmit = form.handleSubmit((_, e) => {
    startTransition(() => {
      const formData = new FormData(e?.target as HTMLFormElement);
      formAction(formData);
    });
  });

  return {
    form,
    state,
    formAction,
    handleSubmit,
    isPending,
  };
}
