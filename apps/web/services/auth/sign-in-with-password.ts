import { api } from '@/services/api'

export interface SignInWithPasswordRequest {
  email: string
  password: string
}

export interface SignInWithPasswordResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithPasswordRequest): Promise<SignInWithPasswordResponse> {
  const { data } = await api.post<SignInWithPasswordResponse>(
    '/sessions/password',
    {
      email,
      password,
    }
  )

  return data
}
