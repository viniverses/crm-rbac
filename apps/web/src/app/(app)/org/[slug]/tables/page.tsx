import { Database, Plus } from 'lucide-react';
import Link from 'next/link';

import { getCurrentOrganization } from '@/auth/auth';
import { Button } from '@/components/ui/button';
import { getOrgUrl } from '@/lib/utils';

export default async function SchemaPage() {
  const org = await getCurrentOrganization();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Database strokeWidth={0.8} className="text-muted-foreground mb-2 h-10 w-10" />
      <h3 className="text-lg font-medium">Nenhuma tabela selecionada</h3>
      <p className="text-muted-foreground">Selecione uma tabela da lista ou crie uma nova para começar a editar</p>
      <Link href={getOrgUrl(org!, 'tables/create')}>
        <Button className="mt-4">
          <Plus className="mr-1 h-4 w-4" />
          Criar Nova Tabela
        </Button>
      </Link>
    </div>
  );
}
