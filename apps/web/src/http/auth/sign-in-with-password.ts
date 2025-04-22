import { api } from '@/http/api';
import { handleApiError } from '@/http/error-handler';

import { APIResponse } from '../types';

interface SignInWithPasswordRequest {
  email: string;
  password: string;
}

interface SignInWithPasswordResponse {
  token: string;
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithPasswordRequest): Promise<APIResponse<SignInWithPasswordResponse>> {
  try {
    const response = await api
      .post('sessions/password', {
        json: {
          email,
          password,
        },
      })
      .json<SignInWithPasswordResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
