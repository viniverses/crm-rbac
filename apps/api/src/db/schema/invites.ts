import { relations, sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { organizations } from './organizations';
import { roleEnum } from './role';
import { users } from './users';

export const invites = pgTable(
  'invites',
  {
    id: uuid('id')
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    email: text('email').notNull(),
    role: roleEnum('role').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    authorId: uuid('author_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    organizationId: uuid('organization_id')
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [index('email_idx').on(table.email), unique().on(table.email, table.organizationId)],
);

export const invitesRelations = relations(invites, ({ one }) => ({
  author: one(users, {
    fields: [invites.authorId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [invites.organizationId],
    references: [organizations.id],
  }),
}));
