import { AiWebBrowsingIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Slash } from 'lucide-react';

import { ThemeSwitcher } from '../theme/theme-switcher';
import { OrganizationSwitcher } from './organization-switcher';
import { UserNav } from './user-nav';

export async function Header() {
  return (
    <header className="bg-background supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b py-2 backdrop-blur">
      <div className="flex items-center justify-center">
        <div className="container mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-sm bg-blue-950 p-1.5">
                <HugeiconsIcon icon={AiWebBrowsingIcon} className="text-white" size={23} />
              </div>
              <h2 className="text-2xl font-semibold">Synapse</h2>
            </div>
            <Slash className="text-border size-4 -rotate-[24deg]" />
            <div className="flex items-center gap-2">
              <OrganizationSwitcher />
              <ThemeSwitcher />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
