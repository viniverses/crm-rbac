import { api } from '@/http/api';

interface SignInWithGithubRequest {
  code: string;
}

interface SignInWithGithubResponse {
  token: string;
}

export async function signInWithGithub({ code }: SignInWithGithubRequest): Promise<SignInWithGithubResponse> {
  const response = await api.post('sessions/github', {
    json: {
      code,
    },
  });

  return response.json<SignInWithGithubResponse>();
}
