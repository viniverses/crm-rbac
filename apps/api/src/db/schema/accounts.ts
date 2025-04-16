import { relations, sql } from 'drizzle-orm';
import { pgEnum, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

import { users } from './users';

export const accountProviderEnum = pgEnum('account_provider', [
  'google',
  'github',
]);

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    provider: accountProviderEnum('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => [unique().on(t.provider, t.userId)],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
