import { Plus } from 'lucide-react';
import Link from 'next/link';

import { getCurrentOrganization } from '@/auth/auth';
import { TableList } from '@/components/schema-builder/table-list';
import { Button } from '@/components/ui/button';
import { getEntities } from '@/http/entities/get-entities';
import { getOrgUrl } from '@/lib/utils';

import { TransitionLayout } from './transition-layout';

export default async function TablesLayout({ children }: { children: React.ReactNode }) {
  const org = await getCurrentOrganization();
  const response = await getEntities({ org: org! });

  if (!response.success) {
    return null;
  }

  const { entities } = response.data;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-sm border p-2.5">
            <h2 className="text-xl font-semibold">Tabelas</h2>
            <Link href={getOrgUrl(org!, 'tables/create')}>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="mr-1 h-4 w-4" />
                Adicionar Tabela
              </Button>
            </Link>
          </div>
          <TableList tables={entities} orgSlug={org!} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-1 rounded-sm border p-5">
            <TransitionLayout>{children}</TransitionLayout>
          </div>
        </div>
      </div>
    </div>
  );
}
