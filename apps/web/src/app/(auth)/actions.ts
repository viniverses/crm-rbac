'use server';

import { cookies } from 'next/headers';

import type { FormState } from '@/hooks/use-hybrid-form';
import { createUser } from '@/http/auth/create-user';
import { signInWithPassword } from '@/http/auth/sign-in-with-password';
import { handleApiError } from '@/http/error-handler';
import { parseFormData } from '@/lib/zod-error-handler';

import { registerFormSchema } from './register/schema';
import { signInFormSchema } from './sign-in/schema';

export async function signIn(formData: FormData): Promise<FormState> {
  try {
    const data = parseFormData(signInFormSchema, formData);

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 250);
    });

    const response = await signInWithPassword(data);

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    const { token } = response.data;

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      success: true,
      message: 'Sign in successful',
    };
  } catch (error) {
    return handleApiError(error);
  }
}

export async function register(formData: FormData): Promise<FormState> {
  try {
    const data = parseFormData(registerFormSchema, formData);

    new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });

    const response = await createUser({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    return {
      success: true,
      message: 'Usuário criado com sucesso.',
    };
  } catch (error) {
    return handleApiError(error);
  }
}
