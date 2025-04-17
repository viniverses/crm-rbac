import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { invites, members, users } from '@/db/schema';
import { auth } from '@/middlewares/auth';

import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Accept an invite',
          operationId: 'acceptInvite',
          security: [{ bearerAuth: [] }],
          params: z.object({
            inviteId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const { inviteId } = request.params;

        const invite = await db.query.invites.findFirst({
          where: eq(invites.id, inviteId),
        });

        if (!invite) {
          throw new NotFoundError('Invite not found');
        }

        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) {
          throw new BadRequestError('User not found');
        }

        if (user.email !== invite.email) {
          throw new BadRequestError('User email does not match invite email');
        }

        try {
          await db.transaction(async (tx) => {
            await tx.insert(members).values({
              userId,
              organizationId: invite.organizationId,
              role: invite.role,
            });

            await tx.delete(invites).where(eq(invites.id, inviteId));
          });
        } catch (error) {
          throw new BadRequestError('Failed to accept invite');
        }

        return reply.status(204).send();
      },
    );
}
