import { api } from '../api';
import { handleApiError } from '../error-handler';
import { APIResponse } from '../types';

interface GetProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export async function getProfile(): Promise<APIResponse<GetProfileResponse>> {
  try {
    const response = await api.get('profile').json<GetProfileResponse>();

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return handleApiError(error);
  }
}
