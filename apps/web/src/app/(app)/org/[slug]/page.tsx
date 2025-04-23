import { ErrorMessage } from '@/components/error-message';
import { getOrganization } from '@/http/organizations/get-organization';

import { OrganizationHeader } from './organization-header';

interface OrganizationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { slug } = await params;
  const response = await getOrganization(slug);

  if (!response.success) {
    return <ErrorMessage message={response.message} />;
  }

  const { organization } = response.data;

  return (
    <div className="space-y-6">
      <OrganizationHeader organization={organization} />
    </div>
  );
}
