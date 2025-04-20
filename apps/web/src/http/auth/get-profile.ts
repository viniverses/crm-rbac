import { api } from '../api';

interface GetProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get('profile');

  return response.json<GetProfileResponse>();
}
