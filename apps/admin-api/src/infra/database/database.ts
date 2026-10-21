import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { relations } from './relations.ts';

export type Database = NodePgDatabase<typeof relations>;
