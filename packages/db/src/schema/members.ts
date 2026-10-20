import { InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, timestamp, unique, uuid } from 'drizzle-orm/pg-core';

import { organizations } from './organizations';
import { roleEnum } from './role';
import { users } from './users';

export const members = pgTable(
  'members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    role: roleEnum('role').notNull().default('MEMBER'),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at'),
  },
  (table) => [unique().on(table.organizationId, table.userId)],
);

export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

export type Member = InferSelectModel<typeof members>;
