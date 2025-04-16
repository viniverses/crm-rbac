import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { organizations } from './organizations';
import { roleEnum } from './role';

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
  (table) => [
    index('email_idx').on(table.email),
    unique().on(table.email, table.organizationId),
  ],
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
