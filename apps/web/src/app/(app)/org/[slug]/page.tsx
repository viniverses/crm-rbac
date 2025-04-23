import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrganization } from '@/http/organizations/get-organization';

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
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Organização</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nome: {organization.name}</p>
          <p>Slug: {organization.slug}</p>
          <p>Avatar: {organization.avatarUrl}</p>
          <p>Domínio: {organization.domain}</p>
          <p>Deve anexar usuários por domínio: {organization.shouldAttachUsersByDomain ? 'Sim' : 'Não'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
