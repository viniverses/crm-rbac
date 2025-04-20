'use server';

import { HTTPError } from 'ky';
import { cookies } from 'next/headers';

import type { FormState } from '@/hooks/use-hybrid-form';
import { signInWithPassword } from '@/http/auth/sign-in-with-password';

import { signInFormSchema } from './schema';

export async function signIn(formData: FormData): Promise<FormState> {
  try {
    const parsedFormData = Object.fromEntries(formData);

    const { success, data, error } = signInFormSchema.safeParse(parsedFormData);

    if (!success) {
      const fields: Record<string, string> = {};
      for (const key of Object.keys(parsedFormData)) {
        fields[key] = parsedFormData[key].toString();
      }

      return {
        message: 'Invalid form data',
        success: false,
        errors: error.flatten().fieldErrors,
        fields,
      };
    }

    new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });

    const { token } = await signInWithPassword(data);

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
    if (error instanceof HTTPError) {
      const { message } = await error.response.json<{ message: string }>();
      return {
        success: false,
        message,
      };
    }

    return {
      success: false,
      message: 'Unexpected error. Please try again later.',
    };
  }
}
