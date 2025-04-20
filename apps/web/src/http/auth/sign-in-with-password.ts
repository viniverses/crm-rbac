import { api } from '@/http/api';

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
}: SignInWithPasswordRequest): Promise<SignInWithPasswordResponse> {
  const response = await api.post('sessions/password', {
    json: {
      email,
      password,
    },
  });

  return response.json<SignInWithPasswordResponse>();
}
