import { OrganizationForm } from '@/app/(app)/org/organization-form';

export default function CreateOrganizationPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Criar Organização</h1>
      <OrganizationForm />
    </div>
  );
}
