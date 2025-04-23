import { OrgTabs } from './tabs';

export default async function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <OrgTabs />
      {children}
    </div>
  );
}
