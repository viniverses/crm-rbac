import { ability } from '@/auth/auth';

import { ThemeSwitcher } from '../theme/theme-switcher';
import { OrganizationSwitcher } from './organization-switcher';
import { UserNav } from './user-nav';

export async function Header() {
  const permissions = await ability();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex items-center justify-center">
        <div className="container mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between">
          <div className="flex items-center gap-2">
            <OrganizationSwitcher />
            {permissions?.can('get', 'Project') && <span>Projetos</span>}
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
