'use client';

import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useHybridForm } from '@/hooks/use-hybrid-form';

import { register } from '../actions';
import { type RegisterForm, registerFormSchema } from './schema';

export function RegisterForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { form, formAction, state, isPending, handleSubmit } = useHybridForm<RegisterForm>({
    schema: registerFormSchema,
    serverAction: register,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    onSuccess: () => {
      const queryParams = new URLSearchParams({
        email: form.getValues('email'),
      });
      router.push(`/sign-in?${queryParams.toString()}`);
    },
  });

  const togglePasswordVisibility = () => setIsPasswordVisible((prevState) => !prevState);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={handleSubmit} ref={formRef} action={formAction} className="grid gap-6">
            {!state.success && state.message && (
              <FormErrorAlert title="Falha ao criar conta" description={state.message} />
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage>{state.error?.issues?.name?.[0]}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seuemail@exemplo.com" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage>{state.error?.issues?.email?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={isPasswordVisible ? 'text' : 'password'} autoComplete="new-password" {...field} />
                      <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        aria-pressed={isPasswordVisible}
                        aria-controls="password"
                      >
                        {isPasswordVisible ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage>{state.error?.issues?.password?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type={isPasswordVisible ? 'text' : 'password'} autoComplete="new-password" {...field} />
                      <button
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={togglePasswordVisibility}
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                        aria-pressed={isPasswordVisible}
                        aria-controls="password"
                      >
                        {isPasswordVisible ? (
                          <EyeOffIcon size={16} aria-hidden="true" />
                        ) : (
                          <EyeIcon size={16} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage>{state.error?.issues?.passwordConfirmation?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Criar conta'}
            </Button>
          </form>
        </Form>
      </div>
      <div className="mt-4 text-center text-sm">
        Já tem uma conta?{' '}
        <Link href="/sign-in" className="underline underline-offset-4">
          Faça login
        </Link>
      </div>
    </div>
  );
}
