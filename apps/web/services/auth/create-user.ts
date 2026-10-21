import { api } from '@/services/api'

export interface CreateUserRequest {
  email: string
  password: string
  name: string
}

export interface CreateUserResponse {
  userId: string
}

export async function createUser({
  email,
  password,
  name,
}: CreateUserRequest): Promise<CreateUserResponse> {
  const { data } = await api.post<CreateUserResponse>('/users', {
    email,
    password,
    name,
  })

  return data
}
