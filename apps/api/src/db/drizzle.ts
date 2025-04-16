import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

import * as schema from './schema';

config({ path: '.env' });

export const db = drizzle({
  connection: process.env.DATABASE_URL!,
  schema,
  ws,
});
