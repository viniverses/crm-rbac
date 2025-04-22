import { OrganizationForm } from '@/app/(app)/org/organization-form';
import { getOrganization } from '@/http/organizations/get-organization';

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { slug } = await params;

  const { organization } = await getOrganization(slug);

  return (
    <div>
      <div>Organization Page {slug}</div>
      <OrganizationForm
        defaultValues={{
          name: organization.name,
          domain: organization.domain,
          shouldAttachUsersByDomain: organization.shouldAttachUsersByDomain,
          avatarUrl: organization.avatarUrl ?? undefined,
        }}
        mode="edit"
      />
    </div>
  );
}
