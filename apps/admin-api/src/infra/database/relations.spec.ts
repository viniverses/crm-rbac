import { drizzle } from 'drizzle-orm/node-postgres';
import { describe, expect, it } from 'vitest';

import { relations } from './relations.ts';

describe('admin relations', () => {
  it('registers the relational query API', () => {
    const db = drizzle.mock({ relations });

    expect(db.query.adminInvites).toBeDefined();
    expect(db.query.workspaces).toBeDefined();
  });
});
