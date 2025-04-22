import { OrganizationForm } from '@/app/(app)/org/organization-form';
import { ErrorMessage } from '@/components/error-message';
import { getOrganization } from '@/http/organizations/get-organization';

interface UpdateOrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function UpdateOrganizationPage({ params }: UpdateOrganizationPageProps) {
  const { slug } = await params;

  const response = await getOrganization(slug);

  if (!response.success) {
    return <ErrorMessage message={response.message} />;
  }

  const { organization } = response.data;

  return (
    <div>
      <div>Update Organization Page</div>
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
