import { api } from '@/http/api';

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

interface CreateUserResponse {
  userId: string;
}

export async function createUser({ email, password, name }: CreateUserRequest): Promise<CreateUserResponse> {
  const response = await api.post('users', {
    json: {
      email,
      password,
      name,
    },
  });

  return response.json<CreateUserResponse>();
}
