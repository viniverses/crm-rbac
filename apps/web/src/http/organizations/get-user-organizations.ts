import { Role } from '@crm/auth';

import { api } from '@/http/api';

interface GetUserOrganizationsResponse {
  organizations: Array<{
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    role: Role;
  }>;
}

export async function getUserOrganizations(): Promise<GetUserOrganizationsResponse> {
  const response = await api.get('organizations');

  return response.json<GetUserOrganizationsResponse>();
}
