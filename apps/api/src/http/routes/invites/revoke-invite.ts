import { and, eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { invites } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { NotFoundError } from '../errors/not-found-error';
import { UnauthorizedError } from '../errors/unauthorized-error';

export async function revokeInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites/:inviteId',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Revoke an invite',
          operationId: 'revokeInvite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, inviteId } = request.params;

        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('delete', 'Invite')) {
          throw new UnauthorizedError(`You're not allowed to create new invites.`);
        }

        const invite = await db.query.invites.findFirst({
          where: and(eq(invites.id, inviteId), eq(invites.organizationId, organization.id)),
        });

        if (!invite) {
          throw new NotFoundError('Invite not found');
        }

        await db.delete(invites).where(eq(invites.id, inviteId));

        return reply.status(204).send();
      },
    );
}
