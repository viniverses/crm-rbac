import { InferSelectModel, relations, sql } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { invites } from './invites';
import { members } from './members';
import { projects } from './projects';
import { users } from './users';

export const organizations = pgTable('organizations', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain').unique(),
  shouldAttachUsersByDomain: boolean('should_attach_users_by_domain')
    .notNull()
    .default(false),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
  ownerId: uuid('owner_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    members: many(members),
    projects: many(projects),
    invites: many(invites),
    owner: one(users, {
      fields: [organizations.ownerId],
      references: [users.id],
    }),
  }),
);

export type Organization = InferSelectModel<typeof organizations>;
