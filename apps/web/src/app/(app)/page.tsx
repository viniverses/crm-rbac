import { getCurrentUser } from '@/auth/auth';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const userResponse = await getCurrentUser();

  if (!userResponse.success) {
    return <ErrorMessage message={userResponse.message} />;
  }

  const { user } = userResponse.data;

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full gap-0">
        <CardHeader>
          <CardTitle>Olá, {user?.name}! 👋</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-muted-foreground">Selecione uma organização para continuar.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
