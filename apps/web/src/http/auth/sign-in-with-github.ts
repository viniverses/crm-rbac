import { api } from '@/http/api';

import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface SignInWithGithubRequest {
  code: string;
}

interface SignInWithGithubResponse {
  token: string;
}

export async function signInWithGithub({
  code,
}: SignInWithGithubRequest): Promise<APIResponse<SignInWithGithubResponse>> {
  try {
    const response = await api
      .post('sessions/github', {
        json: {
          code,
        },
      })
      .json<SignInWithGithubResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
