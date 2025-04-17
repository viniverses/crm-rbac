import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { invites, users } from '@/db/schema';
import { auth } from '@/middlewares/auth';

import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';

export async function rejectInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/invites/:inviteId/reject',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Reject an invite',
          operationId: 'rejectInvite',
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

        await db.delete(invites).where(eq(invites.id, inviteId));

        return reply.status(204).send();
      },
    );
}
