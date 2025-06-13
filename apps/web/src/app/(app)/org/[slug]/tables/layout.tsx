import { Plus } from 'lucide-react';
import Link from 'next/link';

import { getCurrentOrganization } from '@/auth/auth';
import { TableList } from '@/components/schema-builder/table-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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
    <div className="container mx-auto">
      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <div className="flex flex-col gap-6">
          <Card className="gap-0 p-0">
            <CardHeader className="space-y-2 p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Tabelas</CardTitle>
                <Link href={getOrgUrl(org!, 'tables/create')}>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Tabela
                  </Button>
                </Link>
              </div>
              <Separator className="opacity-50" />
              <CardDescription className="text-muted-foreground text-sm">
                Selecione uma tabela para editar ou criar uma nova.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 py-0">
              <Separator className="mb-4" />
              <TableList tables={entities} orgSlug={org!} />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col">
          <Card className="flex w-full flex-1 overflow-hidden rounded-md border p-6">{children}</Card>
        </div>
      </div>
    </div>
  );
}
