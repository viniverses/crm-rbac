import {
  index,
  inet,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const adminRoleName = pgEnum('admin_role_name', [
  'superadmin',
  'finance',
  'support',
  'auditor',
  'operator',
]);

export const adminUserStatus = pgEnum('admin_user_status', [
  'active',
  'inactive',
]);

export const workspaceStatus = pgEnum('workspace_status', [
  'provisioning',
  'active',
  'suspended',
  'failed',
]);

export const databaseProvider = pgEnum('database_provider', ['neon', 'aws']);

export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  status: adminUserStatus('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const adminRoles = pgTable('admin_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: adminRoleName('name').notNull().unique(),
  description: text('description'),
});

export const adminUserRoles = pgTable(
  'admin_user_roles',
  {
    adminUserId: uuid('admin_user_id')
      .notNull()
      .references(() => adminUsers.id, { onDelete: 'cascade' }),
    adminRoleId: uuid('admin_role_id')
      .notNull()
      .references(() => adminRoles.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.adminUserId, table.adminRoleId] })],
);

export const adminRolePermissions = pgTable(
  'admin_role_permissions',
  {
    adminRoleId: uuid('admin_role_id')
      .notNull()
      .references(() => adminRoles.id, { onDelete: 'cascade' }),
    action: text('action').notNull(),
    subject: text('subject').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.adminRoleId, table.action, table.subject] }),
  ],
);

export const adminInvites = pgTable('admin_invites', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  adminRoleId: uuid('admin_role_id')
    .notNull()
    .references(() => adminRoles.id),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  invitedBy: uuid('invited_by')
    .notNull()
    .references(() => adminUsers.id),
});

export const adminSessions = pgTable(
  'admin_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    adminUserId: uuid('admin_user_id')
      .notNull()
      .references(() => adminUsers.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ip: inet('ip'),
    userAgent: text('user_agent'),
  },
  (table) => [index('admin_sessions_admin_user_id_idx').on(table.adminUserId)],
);

export const plans = pgTable('plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  priceCents: integer('price_cents').notNull(),
  limits: jsonb('limits').$type<Record<string, unknown>>().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  status: workspaceStatus('status').default('provisioning').notNull(),
  planId: uuid('plan_id')
    .notNull()
    .references(() => plans.id),
  dbProvider: databaseProvider('db_provider').notNull(),
  dbConnectionEnc: text('db_connection_enc'),
  schemaVersion: integer('schema_version').default(0).notNull(),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => adminUsers.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const workspaceDomains = pgTable(
  'workspace_domains',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    domain: text('domain').notNull().unique(),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
  },
  (table) => [
    index('workspace_domains_workspace_id_idx').on(table.workspaceId),
  ],
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    planId: uuid('plan_id')
      .notNull()
      .references(() => plans.id),
    status: text('status').notNull(),
    currentPeriodEnd: timestamp('current_period_end', {
      withTimezone: true,
    }).notNull(),
  },
  (table) => [index('subscriptions_workspace_id_idx').on(table.workspaceId)],
);

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    amountCents: integer('amount_cents').notNull(),
    status: text('status').notNull(),
    dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
  },
  (table) => [index('invoices_workspace_id_idx').on(table.workspaceId)],
);

export const provisioningJobs = pgTable(
  'provisioning_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    step: text('step').notNull(),
    status: text('status').notNull(),
    error: text('error'),
    attempts: integer('attempts').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('provisioning_jobs_workspace_id_idx').on(table.workspaceId),
  ],
);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    adminUserId: uuid('admin_user_id')
      .notNull()
      .references(() => adminUsers.id),
    workspaceId: uuid('workspace_id').references(() => workspaces.id),
    action: text('action').notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('audit_logs_admin_user_id_idx').on(table.adminUserId),
    index('audit_logs_workspace_id_idx').on(table.workspaceId),
  ],
);

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;

export type AdminRole = typeof adminRoles.$inferSelect;
export type NewAdminRole = typeof adminRoles.$inferInsert;

export type AdminUserRole = typeof adminUserRoles.$inferSelect;
export type NewAdminUserRole = typeof adminUserRoles.$inferInsert;

export type AdminRolePermission = typeof adminRolePermissions.$inferSelect;
export type NewAdminRolePermission = typeof adminRolePermissions.$inferInsert;

export type AdminInvite = typeof adminInvites.$inferSelect;
export type NewAdminInvite = typeof adminInvites.$inferInsert;

export type AdminSession = typeof adminSessions.$inferSelect;
export type NewAdminSession = typeof adminSessions.$inferInsert;

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

export type WorkspaceDomain = typeof workspaceDomains.$inferSelect;
export type NewWorkspaceDomain = typeof workspaceDomains.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type ProvisioningJob = typeof provisioningJobs.$inferSelect;
export type NewProvisioningJob = typeof provisioningJobs.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
