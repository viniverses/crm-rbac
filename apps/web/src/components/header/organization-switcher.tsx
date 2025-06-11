import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Building2, ChevronsUpDown, PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { getCurrentOrganization } from '@/auth/auth';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { getUserOrganizations } from '@/http/organizations/get-user-organizations';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export async function OrganizationSwitcher() {
  const currentOrganizationSlug = await getCurrentOrganization();
  const userOrganizationsResponse = await getUserOrganizations();
  let organizations = null;
  let currentOrganization = null;

  if (userOrganizationsResponse.success) {
    organizations = userOrganizationsResponse.data.organizations;
    currentOrganization = organizations?.find((organization) => organization.slug === currentOrganizationSlug);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-52 justify-between">
          <>
            {currentOrganization ? (
              <>
                <Avatar className="size-5 overflow-hidden rounded-full">
                  {currentOrganization.avatarUrl && (
                    <AvatarImage src={currentOrganization.avatarUrl} alt={currentOrganization.name} />
                  )}
                  <AvatarFallback>
                    <Building2 className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="truncate text-sm">{currentOrganization.name}</span>
              </>
            ) : (
              <span className="text-muted-foreground truncate text-sm">Organização</span>
            )}
            <ChevronsUpDown className="ml-auto opacity-50" />
          </>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar..." />
          <CommandList>
            <CommandEmpty>Nenhuma organização encontrada.</CommandEmpty>
            <CommandGroup heading="Organizações">
              {organizations?.map((organization) => (
                <CommandItem key={organization.id} className="text-sm" asChild>
                  <a href={`/org/${organization.slug}`}>
                    <Avatar className="flex size-5 items-center justify-center overflow-hidden rounded-full border text-[10px]">
                      {organization.avatarUrl && <AvatarImage src={organization.avatarUrl} alt={organization.name} />}
                      <AvatarFallback>
                        <Building2 className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm">{organization.name}</span>
                  </a>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem asChild>
              <Link href="/create-organization" passHref className="cursor-pointer">
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:bg-primary/10 flex w-full cursor-pointer items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Criar Organização</span>
                </Button>
              </Link>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
