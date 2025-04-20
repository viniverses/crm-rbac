'use server';

import { HTTPError } from 'ky';

import type { FormState } from '@/hooks/use-hybrid-form';
import { createUser } from '@/http/create-user';

import { registerFormSchema } from './schema';

export async function register(formData: FormData): Promise<FormState> {
  try {
    const parsedFormData = Object.fromEntries(formData);

    const { success, data, error } = registerFormSchema.safeParse(parsedFormData);

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

    await createUser(data);

    return {
      success: true,
      message: 'User created successfully',
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
