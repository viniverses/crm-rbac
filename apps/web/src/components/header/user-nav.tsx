import { LogOut, Settings, User } from 'lucide-react';

import { getCurrentUser } from '@/auth/auth';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export async function UserNav() {
  const currentUserResponse = await getCurrentUser();

  if (!currentUserResponse.success) {
    return null;
  }

  const { user } = currentUserResponse.data;

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-start pr-4 pl-2">
            <Avatar className="size-6 rounded-[4px]">
              <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} className="rounded-[4px]" />
              <AvatarFallback className="rounded-[4px] border">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </div>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="/api/auth/sign-out" className="flex w-full items-center gap-2 text-red-600">
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              <span>Log out</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
