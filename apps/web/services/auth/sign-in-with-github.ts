import { api } from '@/services/api'

export interface SignInWithGithubRequest {
  code: string
}

export interface SignInWithGithubResponse {
  token: string
}

export async function signInWithGithub({
  code,
}: SignInWithGithubRequest): Promise<SignInWithGithubResponse> {
  const { data } = await api.post<SignInWithGithubResponse>(
    '/sessions/github',
    {
      code,
    }
  )

  return data
}
