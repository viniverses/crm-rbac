import { relations, sql } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { organizations } from './organizations';
import { users } from './users';

type EntityField = {
  id: string;
  name: string;
  dataType: string;
  isPrimaryKey: boolean;
  isRequired: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string | null;
  indexType: 'none' | 'index' | 'unique';
  isInvisible: boolean;
};

export const entities = pgTable('entities', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  fields: jsonb('fields').$type<EntityField[]>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  updatedBy: uuid('updated_by').references(() => users.id),
  createdBy: uuid('created_by')
    .references(() => users.id)
    .notNull(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, {
      onDelete: 'cascade',
    }),
});

export const entitiesRelations = relations(entities, ({ one }) => ({
  organization: one(organizations, {
    fields: [entities.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(users, {
    fields: [entities.createdBy],
    references: [users.id],
  }),
  updatedBy: one(users, {
    fields: [entities.updatedBy],
    references: [users.id],
  }),
}));
