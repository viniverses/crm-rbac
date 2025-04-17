import { organizationSchema } from '@crm/auth';
import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { members, organizations } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../errors/bad-request-error';
import { UnauthorizedError } from '../errors/unauthorized-error';

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      '/organizations/:slug/owner',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Transfer organization ownership',
          operationId: 'transferOrganization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            transferToUserId: z.string().uuid(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;

        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getUserMembership(slug);

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('transfer_ownership', authOrganization)) {
          throw new UnauthorizedError('You are not allowed to transfer this organization ownership');
        }

        const { transferToUserId } = request.body;

        const targetMembership = await db.query.members.findFirst({
          where: and(eq(members.organizationId, organization.id), eq(members.userId, transferToUserId)),
        });

        if (!targetMembership) {
          throw new BadRequestError('Target user is not a member of this organization');
        }

        try {
          await db.transaction(async (tx) => {
            await tx
              .update(members)
              .set({
                role: 'ADMIN',
              })
              .where(and(eq(members.id, targetMembership.id)));

            await tx
              .update(organizations)
              .set({
                ownerId: transferToUserId,
              })
              .where(eq(organizations.id, organization.id));
          });
        } catch (error) {
          throw new BadRequestError('Failed to transfer organization ownership');
        }

        return reply.status(204).send();
      },
    );
}
