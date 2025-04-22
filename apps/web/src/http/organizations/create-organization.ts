import { api } from '@/http/api';

interface CreateOrganizationRequest {
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean;
  avatarUrl: string | null;
}

interface CreateOrganizationResponse {
  organizationId: string;
}

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
  avatarUrl,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  const response = await api.post('organizations', {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
    },
  });

  return response.json<CreateOrganizationResponse>();
}
