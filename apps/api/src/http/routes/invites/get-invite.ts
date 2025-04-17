import { roleSchema } from '@crm/auth';
import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { invites, organizations, users } from '@/db/schema';

import { NotFoundError } from '../errors/not-found-error';

export async function getInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/invites/:inviteId',
    {
      schema: {
        tags: ['Invites'],
        summary: 'Get an invite',
        operationId: 'getInvite',
        params: z.object({
          inviteId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            invite: z.object({
              id: z.string().uuid(),
              role: roleSchema,
              email: z.string().email(),
              createdAt: z.date(),
              organization: z.object({
                name: z.string(),
              }),
              author: z
                .object({
                  id: z.string().uuid(),
                  name: z.string().nullable(),
                  avatarUrl: z.string().url().nullable(),
                })
                .nullable(),
            }),
          }),
        },
      },
    },
    async (request) => {
      const { inviteId } = request.params;

      const [invite] = await db
        .select({
          id: invites.id,
          email: invites.email,
          role: invites.role,
          createdAt: invites.createdAt,
          author: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl,
          },
          organization: {
            name: organizations.name,
          },
        })
        .from(invites)
        .innerJoin(users, eq(invites.authorId, users.id))
        .innerJoin(organizations, eq(invites.organizationId, organizations.id))
        .where(eq(invites.id, inviteId));

      if (!invite) {
        throw new NotFoundError('Invite not found');
      }

      return {
        invite,
      };
    },
  );
}
