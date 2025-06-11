import { ChevronDown, LogOut } from 'lucide-react';

import { getCurrentUser } from '@/auth/auth';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export async function UserNav() {
  const currentUserResponse = await getCurrentUser();

  if (!currentUserResponse.success) {
    return null;
  }

  const { user } = currentUserResponse.data;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
          <Avatar className="size-8">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            {user.name && <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>}
          </Avatar>
          <ChevronDown className="text-muted-foreground size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href="/api/auth/sign-out">
              <LogOut className="mr-2 size-4" />
              Sair
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
