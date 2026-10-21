'use server';

import { env } from '@crm/env';
import { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';

import { setAuthToken } from '@/auth/session';
import { createUser } from '@/services/auth/create-user';
import { signInWithPassword } from '@/services/auth/sign-in-with-password';

import { type SignInForm, signInFormSchema } from './sign-in/schema';
import { type SignUpForm, signUpFormSchema } from './sign-up/schema';

export async function signInWithGithub() {
  const githubAuthUrl = new URL('login/oauth/authorize', 'https://github.com');

  githubAuthUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI);
  githubAuthUrl.searchParams.set('scope', 'user');

  redirect(githubAuthUrl.toString());
}

export async function signInWithEmailAndPassword(input: SignInForm) {
  const result = signInFormSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      message: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  try {
    const { token } = await signInWithPassword({ email, password });
    await setAuthToken(token);
  } catch (error) {
    if (!isAxiosError<{ message?: string }>(error)) {
      console.error(error);
    }

    return {
      success: false as const,
      message: isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? 'Não foi possível entrar. Tente novamente.'
        : 'Não foi possível entrar. Tente novamente.',
      errors: null,
    };
  }

  return { success: true as const, message: null, errors: null };
}

export async function signUp(input: SignUpForm) {
  const result = signUpFormSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      message: null,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = result.data;

  try {
    await createUser({ email, password, name });
  } catch (error) {
    if (!isAxiosError<{ message?: string }>(error)) {
      console.error(error);
    }

    return {
      success: false as const,
      message: isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? 'Não foi possível criar a conta. Tente novamente.'
        : 'Não foi possível criar a conta. Tente novamente.',
      errors: null,
    };
  }

  return { success: true as const, message: null, errors: null };
}
