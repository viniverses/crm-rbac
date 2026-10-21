import { defineRelations } from 'drizzle-orm';

import * as schema from './schema.ts';

export const relations = defineRelations(schema, (r) => ({
  adminUsers: {
    roles: r.many.adminUserRoles(),
    invitesSent: r.many.adminInvites(),
    sessions: r.many.adminSessions(),
    workspacesCreated: r.many.workspaces(),
    auditLogs: r.many.auditLogs(),
  },
  adminRoles: {
    users: r.many.adminUserRoles(),
    permissions: r.many.adminRolePermissions(),
    invites: r.many.adminInvites(),
  },
  adminUserRoles: {
    user: r.one.adminUsers({
      from: r.adminUserRoles.adminUserId,
      to: r.adminUsers.id,
    }),
    role: r.one.adminRoles({
      from: r.adminUserRoles.adminRoleId,
      to: r.adminRoles.id,
    }),
  },
  adminRolePermissions: {
    role: r.one.adminRoles({
      from: r.adminRolePermissions.adminRoleId,
      to: r.adminRoles.id,
    }),
  },
  adminInvites: {
    role: r.one.adminRoles({
      from: r.adminInvites.adminRoleId,
      to: r.adminRoles.id,
    }),
    inviter: r.one.adminUsers({
      from: r.adminInvites.invitedBy,
      to: r.adminUsers.id,
    }),
  },
  adminSessions: {
    user: r.one.adminUsers({
      from: r.adminSessions.adminUserId,
      to: r.adminUsers.id,
    }),
  },
  plans: {
    workspaces: r.many.workspaces(),
    subscriptions: r.many.subscriptions(),
  },
  workspaces: {
    plan: r.one.plans({
      from: r.workspaces.planId,
      to: r.plans.id,
    }),
    creator: r.one.adminUsers({
      from: r.workspaces.createdBy,
      to: r.adminUsers.id,
    }),
    domains: r.many.workspaceDomains(),
    subscriptions: r.many.subscriptions(),
    invoices: r.many.invoices(),
    provisioningJobs: r.many.provisioningJobs(),
    auditLogs: r.many.auditLogs(),
  },
  workspaceDomains: {
    workspace: r.one.workspaces({
      from: r.workspaceDomains.workspaceId,
      to: r.workspaces.id,
    }),
  },
  subscriptions: {
    workspace: r.one.workspaces({
      from: r.subscriptions.workspaceId,
      to: r.workspaces.id,
    }),
    plan: r.one.plans({
      from: r.subscriptions.planId,
      to: r.plans.id,
    }),
  },
  invoices: {
    workspace: r.one.workspaces({
      from: r.invoices.workspaceId,
      to: r.workspaces.id,
    }),
  },
  provisioningJobs: {
    workspace: r.one.workspaces({
      from: r.provisioningJobs.workspaceId,
      to: r.workspaces.id,
    }),
  },
  auditLogs: {
    user: r.one.adminUsers({
      from: r.auditLogs.adminUserId,
      to: r.adminUsers.id,
    }),
    workspace: r.one.workspaces({
      from: r.auditLogs.workspaceId,
      to: r.workspaces.id,
    }),
  },
}));
