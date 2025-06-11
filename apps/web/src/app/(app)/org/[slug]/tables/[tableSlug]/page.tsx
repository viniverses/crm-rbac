import { redirect } from 'next/navigation';

import { getCurrentOrganization } from '@/auth/auth';
import { TableEditor } from '@/components/schema-builder/table-editor';
import { getEntity } from '@/http/entities/get-entity';

interface TablePageProps {
  params: Promise<{
    slug: string;
    tableSlug: string;
  }>;
}

export default async function TablePage({ params }: TablePageProps) {
  const { tableSlug } = await params;
  const org = await getCurrentOrganization();

  if (!org) {
    redirect('/');
  }

  const response = await getEntity({ org: org, tableSlug });

  if (!response.success) {
    return null;
  }

  const { entity } = response.data;

  return (
    <div className="flex flex-1 flex-col gap-4">
      <TableEditor
        defaultValues={{
          ...entity,
          tableName: entity.slug,
        }}
        mode="edit"
      />
    </div>
  );
}
