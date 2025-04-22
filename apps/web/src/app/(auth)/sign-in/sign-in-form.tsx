'use client';

import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

import githubIcon from '@/assets/svg/github.svg';
import { FormErrorAlert } from '@/components/form-error-alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useHybridForm } from '@/hooks/use-hybrid-form';

import { signInWithGithub } from '../../../actions';
import { signIn } from '../actions';
import { type SignInForm, signInFormSchema } from './schema';

export function SignInForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = () => setIsPasswordVisible((prevState) => !prevState);

  const { form, formAction, state, isPending, handleSubmit } = useHybridForm<SignInForm>({
    schema: signInFormSchema,
    formRef: formRef,
    serverAction: signIn,
    defaultValues: {
      email: searchParams.get('email') ?? '',
      password: '',
    },
    onSuccess: () => {
      router.push('/');
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <Button variant="outline" className="w-full" onClick={signInWithGithub}>
            <Image src={githubIcon} alt="Login with GitHub" className="size-4 dark:invert" />
            Entre com GitHub
          </Button>
        </div>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">Ou continue com</span>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit} ref={formRef} action={formAction} className="grid gap-6">
            <FormErrorAlert state={state} title="Falha ao autenticar" description={state.message} />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seuemail@exemplo.com" {...field} />
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
                  <div className="flex items-center">
                    <FormLabel>Senha</FormLabel>
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input type={isPasswordVisible ? 'text' : 'password'} {...field} />
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
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Entrar'}
            </Button>
          </form>
        </Form>
      </div>
      <div className="mt-4 text-center text-sm">
        Não tem uma conta?{' '}
        <Link href="/register" className="underline underline-offset-4">
          Criar agora
        </Link>
      </div>
    </div>
  );
}
