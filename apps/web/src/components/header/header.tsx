import { ability } from '@/auth/auth';

import { ThemeSwitcher } from '../theme/theme-switcher';
import { OrganizationSwitcher } from './organization-switcher';
import { UserNav } from './user-nav';

export async function Header() {
  const permissions = await ability();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex items-center justify-center">
        <div className="container flex h-16 max-w-4xl items-center justify-between">
          <OrganizationSwitcher />
          {permissions?.can('get', 'Project') && <span>Projetos</span>}

          <UserNav />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
