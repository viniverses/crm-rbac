export default async function OrgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
