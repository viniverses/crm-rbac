import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
                  <AvatarFallback>{currentOrganization.name.slice(0, 2).toUpperCase()}</AvatarFallback>
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
          <CommandInput placeholder="Search team..." />
          <CommandList>
            <CommandEmpty>Nenhuma organização encontrada.</CommandEmpty>
            <CommandGroup heading="Organizações">
              {organizations?.map((organization) => (
                <CommandItem key={organization.id} className="text-sm" asChild>
                  <a href={`/org/${organization.slug}`}>
                    <Avatar className="mr-2 h-5 w-5 overflow-hidden rounded-xs">
                      {organization.avatarUrl && (
                        <AvatarImage src={organization.avatarUrl} alt={organization.name} className="grayscale" />
                      )}
                      <AvatarFallback>{organization.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {organization.name}
                    <Check className={cn('ml-auto', true ? 'opacity-100' : 'opacity-0')} />
                  </a>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandItem asChild>
              <Link href="/create-organization" passHref className="cursor-pointer">
                <Button variant="ghost" className="flex w-full cursor-pointer items-center gap-2 hover:bg-transparent">
                  <PlusCircle className="h-5 w-5" />
                  Criar Organização
                </Button>
              </Link>
            </CommandItem>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
