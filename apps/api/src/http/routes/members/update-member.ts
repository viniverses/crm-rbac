import { roleSchema } from '@crm/auth';
import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { members } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { NotFoundError } from '../errors/not-found-error';
import { UnauthorizedError } from '../errors/unauthorized-error';

export async function updateMember(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/member/:memberId',
      {
        schema: {
          tags: ['Members'],
          summary: 'Update a member',
          operationId: 'updateMember',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            memberId: z.string().uuid(),
          }),
          body: z.object({
            role: roleSchema,
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, memberId } = request.params;
        const userId = await request.getCurrentUserId();

        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('update', 'User')) {
          throw new UnauthorizedError(`You're not allowed to update this member.`);
        }

        const member = await db.query.members.findFirst({
          where: and(eq(members.id, memberId), eq(members.organizationId, organization.id)),
        });

        if (!member) {
          throw new NotFoundError('Member not found');
        }

        const { role } = request.body;

        await db
          .update(members)
          .set({
            role,
          })
          .where(eq(members.id, memberId));

        return reply.status(204).send();
      },
    );
}
