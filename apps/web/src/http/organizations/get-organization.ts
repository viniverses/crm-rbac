import { Role } from '@crm/auth';

import { api } from '@/http/api';

interface GetOrganizationResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    role: Role;
    domain: string | null;
    shouldAttachUsersByDomain: boolean;
  };
}

export async function getOrganization(slug: string): Promise<GetOrganizationResponse> {
  const response = await api.get(`organizations/${slug}`);

  return response.json<GetOrganizationResponse>();
}
