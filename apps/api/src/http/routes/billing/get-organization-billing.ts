import { and, count, eq, ne } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { members, projects } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { UnauthorizedError } from '../errors/unauthorized-error';

export async function getOrganizationBilling(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/billing',
      {
        schema: {
          tags: ['Billing'],
          summary: 'Get billing details of an organization',
          operationId: 'getOrganizationBilling',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              billing: z.object({
                seats: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                projects: z.object({
                  amount: z.number(),
                  unit: z.number(),
                  price: z.number(),
                }),
                total: z.number(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;

        const userId = await request.getCurrentUserId();

        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('get', 'Billing')) {
          throw new UnauthorizedError('You are not allowed to get the billing details of this organization');
        }

        const [[amountOfMembers], [amountOfProjects]] = await Promise.all([
          db
            .select({ count: count() })
            .from(members)
            .where(and(eq(members.organizationId, organization.id), ne(members.role, 'BILLING'))),

          db.select({ count: count() }).from(projects).where(eq(projects.organizationId, organization.id)),
        ]);

        return {
          billing: {
            seats: {
              amount: amountOfMembers.count,
              unit: 10,
              price: amountOfMembers.count * 10,
            },
            projects: {
              amount: amountOfProjects.count,
              unit: 20,
              price: amountOfProjects.count * 20,
            },
            total: amountOfMembers.count * 10 + amountOfProjects.count * 20,
          },
        };
      },
    );
}
