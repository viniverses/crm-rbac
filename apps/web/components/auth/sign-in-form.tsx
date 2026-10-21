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
  CheckmarkCircle02Icon,
  Copy01Icon,
  GithubIcon,
  Key01Icon,
  Mail01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { signInWithEmailAndPassword, signInWithGithub } from '@/app/(auth)/actions';
import {
  type SignInForm as SignInFormValues,
  signInFormSchema,
} from '@/app/(auth)/sign-in/schema';
import { PasswordInput, usePasswordVisibility } from './password-input';

const iconCrossfadeLayer = cn(
  '[grid-area:1/1] transition-[opacity,filter,scale] duration-300',
  'ease-[cubic-bezier(0.2,0,0,1)]',
  'motion-reduce:scale-100 motion-reduce:blur-[0px]',
);
const iconShown = 'scale-100 opacity-100 blur-[0px]';
const iconHidden = 'scale-[0.25] opacity-0 blur-[4px]';

const DEMO_EMAIL = 'john@spinova.co';
const DEMO_PASSWORD = 'passworddev';

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialEmail = searchParams.get('email') ?? '';
  const justRegistered = searchParams.get('registered') === 'true';
  const oauthError = searchParams.get('error');

  const { visible: showPassword, toggleVisibility } = usePasswordVisibility();
  const [demoFilled, setDemoFilled] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    oauthError ? 'GitHub authentication could not be completed.' : null,
  );

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: initialEmail,
      password: '',
    },
  });

  const { isSubmitting } = form.formState;

  function handleFillDemo() {
    setErrorMessage(null);
    form.setValue('email', DEMO_EMAIL, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    form.setValue('password', DEMO_PASSWORD, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setDemoFilled(true);
    window.setTimeout(() => {
      setDemoFilled(false);
    }, 2000);
  }

  async function onSubmit(values: SignInFormValues) {
    setErrorMessage(null);

    const response = await signInWithEmailAndPassword(values);

    if (!response.success) {
      for (const field of ['email', 'password'] as const) {
        const message = response.errors?.[field]?.[0];
        if (message) form.setError(field, { message });
      }

      if (response.message) {
        setErrorMessage(response.message);
        toast.error(response.message);
      }
      return;
    }

    toast.success('Sign in successful');
    router.push('/');
    router.refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col gap-6">
      {/* Chunk 1: Header */}
      <div className="stagger-item flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Sign in with your workspace credentials to access your deals and
          pipelines.
        </p>
      </div>

      {/* Chunk 2: Form & OAuth */}
      <div className="stagger-item flex flex-col gap-4">
        {justRegistered && !errorMessage && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300"
          >
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              strokeWidth={1.75}
              className="mt-0.5 size-4 shrink-0"
            />
            <span>
              Account created successfully. Sign in with your password below.
            </span>
          </div>
        )}

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
                        placeholder="name@company.com"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <span className="text-[11px] text-muted-foreground">
                      Min. 6 characters
                    </span>
                  </div>
                  <PasswordInput
                    visible={showPassword}
                    onVisibilityToggle={toggleVisibility}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-9 w-full gap-2 rounded-xl bg-indigo-600 ps-4 pe-3.5 text-xs font-semibold text-white! shadow-xs outline-1 -outline-offset-1 outline-white/15 hover:bg-indigo-500 focus-visible:ring-indigo-500/30 **:text-white!"
            >
              <span>{isSubmitting ? 'Signing in...' : 'Sign in to workspace'}</span>
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
            or continue with
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
            <span>Continue with GitHub</span>
          </Button>
        </form>
      </div>

      {/* Chunk 3: Demo Credentials Helper (concentric radii: rounded-2xl p-2 -> rounded-lg) & Footer */}
      <div className="stagger-item flex flex-col gap-4">
        <div className="rounded-2xl border border-transparent bg-sidebar/80 p-2 shadow-(--shadow-border) dark:bg-sidebar-accent/35">
          <div className="flex items-center justify-between gap-2 rounded-lg bg-background/80 px-3 py-2 dark:bg-background/50">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/12 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <HugeiconsIcon
                  icon={Key01Icon}
                  strokeWidth={1.75}
                  className="size-3.5"
                />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[11px] font-semibold text-foreground">
                  Seeded Demo Account
                </p>
                <p className="truncate font-mono text-[10px] text-muted-foreground">
                  {DEMO_EMAIL} &middot; {DEMO_PASSWORD}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-lg border border-transparent bg-sidebar px-2.5 text-[11px] font-medium text-foreground shadow-(--shadow-border) transition-[background-color,box-shadow,scale] duration-150 ease-out hover:bg-sidebar-accent hover:shadow-(--shadow-border-hover) motion-safe:enabled:active:scale-[0.96]"
            >
              <span className="grid place-items-center">
                <span
                  className={cn(
                    iconCrossfadeLayer,
                    demoFilled ? iconShown : iconHidden,
                  )}
                >
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    className="size-3 text-emerald-600 dark:text-emerald-400"
                  />
                </span>
                <span
                  className={cn(
                    iconCrossfadeLayer,
                    demoFilled ? iconHidden : iconShown,
                  )}
                >
                  <HugeiconsIcon
                    icon={Copy01Icon}
                    strokeWidth={1.75}
                    className="size-3 text-muted-foreground"
                  />
                </span>
              </span>
              <span>{demoFilled ? 'Filled' : 'Use demo'}</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/sign-up"
            className="font-semibold text-indigo-600 underline-offset-4 transition-colors duration-150 hover:text-indigo-500 hover:underline dark:text-indigo-400"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
