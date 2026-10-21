import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infra/database/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  migrations: { table: '__admin_drizzle_migrations' },
  ...(process.env.ADMIN_DATABASE_URL
    ? { dbCredentials: { url: process.env.ADMIN_DATABASE_URL } }
    : {}),
});
