'use client';

import { Database, Trash2 } from 'lucide-react';
import Link from 'next/link';

import type { Table } from '@/@types/schema';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableListProps {
  orgSlug: string;
  tables: Table[];
}

export function TableList({ tables, orgSlug }: TableListProps) {
  return (
    <ScrollArea className="bg-background h-[calc(100vh-400px)]">
      {tables.length === 0 ? (
        <div className="flex h-[calc(100vh-400px)] flex-1 flex-col items-center justify-center text-center">
          <Database className="text-muted-foreground mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">Nenhuma tabela criada</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {tables.map((table) => (
            <Link
              key={table.slug}
              href={`/org/${orgSlug}/tables/${table.slug}`}
              className="border-border bg-muted flex cursor-pointer items-center justify-between rounded-sm border px-2 py-1.5 text-black"
            >
              <div className="flex items-center">
                <Database className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">{table.name}</span>
                <span className="ml-2 text-xs opacity-70">({table.fields.length} campos)</span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-muted-foreground/10 h-6 w-6" type="button">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Deletar tabela</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deletar tabela (WIP)</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja deletar a tabela "{table.name}"? Esta ação não pode ser revertida.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction>Deletar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Link>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}
