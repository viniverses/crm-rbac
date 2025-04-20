import { getCurrentUser } from '@/auth/auth';

export default async function Home() {
  const { user } = await getCurrentUser();

  return (
    <div>
      <h1>Home Page</h1>
      <p>User: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
