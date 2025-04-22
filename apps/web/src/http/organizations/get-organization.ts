import { api } from '@/http/api';

interface GetOrganizationResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    avatarUrl: string | null;
    shouldAttachUsersByDomain: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export async function getOrganization(slug: string): Promise<GetOrganizationResponse> {
  const response = await api.get(`organizations/${slug}`);

  return response.json<GetOrganizationResponse>();
}
