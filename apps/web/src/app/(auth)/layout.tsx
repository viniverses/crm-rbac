import { GalleryVerticalEnd } from 'lucide-react';
import { redirect } from 'next/navigation';

import { isAuthenticated } from '@/auth/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (await isAuthenticated()) {
    redirect('/');
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bem vindo(a) ao CRM</CardTitle>
            <CardDescription>Faça login ou crie uma conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        <div className="text-muted-foreground [&_a]:hover:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
          Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a> e{' '}
          <a href="#">Política de Privacidade</a>.
        </div>
      </div>
    </div>
  );
}
