import { getCurrentUser } from '@/auth/auth';
import { ErrorMessage } from '@/components/error-message';

export default async function Home() {
  const userResponse = await getCurrentUser();

  if (!userResponse.success) {
    return <ErrorMessage message={userResponse.message} />;
  }

  const { user } = userResponse.data;

  return (
    <div>
      <h1>Home Page</h1>
      <p>User: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
