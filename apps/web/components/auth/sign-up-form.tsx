'use client';

import { Button } from '@crm/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@crm/ui/components/form';
import { Input } from '@crm/ui/components/input';
import { Separator } from '@crm/ui/components/separator';
import { cn } from '@crm/ui/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircleIcon,
  ArrowRight01Icon,
  Building03Icon,
  CheckmarkCircle02Icon,
  GithubIcon,
  Mail01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { signInWithGithub, signUp } from '@/app/(auth)/actions';
import {
  type SignUpForm as SignUpFormValues,
  signUpFormSchema,
} from '@/app/(auth)/sign-up/schema';
import { PasswordInput, usePasswordVisibility } from './password-input';

export function SignUpForm() {
  const router = useRouter();
  const { visible: showPassword, toggleVisibility } = usePasswordVisibility();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const { isSubmitting } = form.formState;

  const watchedEmail = useWatch({
    control: form.control,
    name: 'email',
    defaultValue: '',
  });
  const watchedPassword = useWatch({
    control: form.control,
    name: 'password',
    defaultValue: '',
  });
  const watchedPasswordConfirmation = useWatch({
    control: form.control,
    name: 'passwordConfirmation',
    defaultValue: '',
  });

  const emailDomain = React.useMemo(() => {
    const parts = (watchedEmail ?? '').trim().split('@');
    if (parts.length !== 2 || !parts[1] || !parts[1].includes('.')) {
      return null;
    }
    return parts[1].toLowerCase();
  }, [watchedEmail]);

  const isPasswordLengthValid = (watchedPassword ?? '').length >= 6;
  const doPasswordsMatch =
    (watchedPasswordConfirmation ?? '').length > 0 &&
    watchedPassword === watchedPasswordConfirmation;

  async function onSubmit(values: SignUpFormValues) {
    setErrorMessage(null);

    const response = await signUp(values);

    if (!response.success) {
      for (const field of ['name', 'email', 'password', 'passwordConfirmation'] as const) {
        const message = response.errors?.[field]?.[0];
        if (message) form.setError(field, { message });
      }

      if (response.message) {
        setErrorMessage(response.message);
        toast.error(response.message);
      }
      return;
    }

    toast.success('Usuário criado com sucesso.');
    const queryParams = new URLSearchParams({
      registered: 'true',
      email: values.email,
    });
    router.push(`/sign-in?${queryParams.toString()}`);
  }

  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col gap-6">
      {/* Chunk 1: Header */}
      <div className="stagger-item flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Start managing your deals, contacts, and team permissions in minutes.
        </p>
      </div>

      {/* Chunk 2: Form & OAuth */}
      <div className="stagger-item flex flex-col gap-4">
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
          >
            <HugeiconsIcon
              icon={AlertCircleIcon}
              strokeWidth={1.75}
              className="mt-0.5 size-4 shrink-0"
            />
            <span>{errorMessage}</span>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3.5"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={UserIcon}
                      strokeWidth={1.6}
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="name"
                        placeholder="John Doe"
                        disabled={isSubmitting}
                        className="h-9 rounded-xl bg-background pr-3 pl-9 text-xs shadow-2xs transition-[border-color,box-shadow,background-color] duration-150 ease-out hover:border-ring/50 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/25"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work email</FormLabel>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      strokeWidth={1.6}
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="name@spinova.co"
                        disabled={isSubmitting}
                        className="h-9 rounded-xl bg-background pr-3 pl-9 text-xs shadow-2xs transition-[border-color,box-shadow,background-color] duration-150 ease-out hover:border-ring/50 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/25"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                  {emailDomain && (
                    <div className="flex items-start gap-1.5 px-0.5 text-[11px] text-muted-foreground">
                      <HugeiconsIcon
                        icon={Building03Icon}
                        strokeWidth={1.6}
                        className="mt-0.5 size-3.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                      />
                      <span>
                        If an organization for{' '}
                        <strong className="font-semibold text-foreground">
                          @{emailDomain}
                        </strong>{' '}
                        allows it, you&apos;ll join automatically.
                      </span>
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <PasswordInput
                      visible={showPassword}
                      onVisibilityToggle={toggleVisibility}
                      autoComplete="new-password"
                      placeholder="Min. 6 chars"
                      disabled={isSubmitting}
                      className="pr-8"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <PasswordInput
                      visible={showPassword}
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      disabled={isSubmitting}
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password criteria indicators */}
            <div className="flex items-center gap-4 px-0.5 text-[11px]">
              <span
                className={cn(
                  'inline-flex items-center gap-1 transition-colors duration-150',
                  isPasswordLengthValid
                    ? 'font-medium text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground',
                )}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  strokeWidth={1.75}
                  className="size-3.5"
                />
                At least 6 characters
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 transition-colors duration-150',
                  doPasswordsMatch
                    ? 'font-medium text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground',
                )}
              >
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  strokeWidth={1.75}
                  className="size-3.5"
                />
                Passwords match
              </span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-9 w-full gap-2 rounded-xl bg-indigo-600 ps-4 pe-3.5 text-xs font-semibold text-white! shadow-xs outline-1 -outline-offset-1 outline-white/15 hover:bg-indigo-500 focus-visible:ring-indigo-500/30 **:text-white!"
            >
              <span>
                {isSubmitting ? 'Creating account...' : 'Create workspace account'}
              </span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="size-3.5 transition-transform duration-150 ease-out group-hover/button:translate-x-0.5 rtl:-scale-x-100"
              />
            </Button>
          </form>
        </Form>

        <div className="relative flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <span className="text-[11px] font-medium text-muted-foreground">
            or sign up with
          </span>
          <Separator className="flex-1" />
        </div>

        <form action={signInWithGithub}>
          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting}
            className="h-9 w-full gap-2 rounded-xl border-transparent bg-background ps-3.5 pe-4 text-xs font-medium shadow-(--shadow-border) hover:bg-muted/50 hover:shadow-(--shadow-border-hover) dark:bg-sidebar-accent/40 dark:hover:bg-sidebar-accent/70"
          >
            <HugeiconsIcon icon={GithubIcon} strokeWidth={1.75} className="size-4" />
            <span>Sign up with GitHub</span>
          </Button>
        </form>
      </div>

      {/* Chunk 3: Footer */}
      <div className="stagger-item">
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="font-semibold text-indigo-600 underline-offset-4 transition-colors duration-150 hover:text-indigo-500 hover:underline dark:text-indigo-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
