import { api } from '@/services/api';

export interface GetProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

export async function getProfile(): Promise<GetProfileResponse> {
  const { data } = await api.get<GetProfileResponse>('/profile');

  return data;
}
