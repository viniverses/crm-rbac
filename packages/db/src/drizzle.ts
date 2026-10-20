import { env } from '@crm/env';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import * as schema from './schema';

export const db = drizzle({
  connection: env.DATABASE_URL,
  schema,
  ws,
});
