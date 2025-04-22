import { api } from '@/http/api';

interface UpdateOrganizationRequest {
  slug: string;
  name: string;
  domain: string | null;
  shouldAttachUsersByDomain: boolean;
  avatarUrl: string | null;
}

type UpdateOrganizationResponse = void;

export async function updateOrganization({
  slug,
  name,
  domain,
  shouldAttachUsersByDomain,
  avatarUrl,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
  await api.put(`organizations/${slug}`, {
    json: {
      name,
      domain,
      shouldAttachUsersByDomain,
      avatarUrl,
    },
  });
}
