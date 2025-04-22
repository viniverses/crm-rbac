import { api } from '@/http/api';
import { handleApiError } from '@/http/error-handler';

import { APIResponse } from './../types';
interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

interface CreateUserResponse {
  userId: string;
}

export async function createUser({
  email,
  password,
  name,
}: CreateUserRequest): Promise<APIResponse<CreateUserResponse>> {
  try {
    const response = await api
      .post('users', {
        json: {
          email,
          password,
          name,
        },
      })
      .json<CreateUserResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
