import { roleSchema } from '@crm/auth';
import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { invites, organizations, users } from '@/db/schema';
import { auth } from '@/middlewares/auth';

import { BadRequestError } from '../errors/bad-request-error';

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get user pending invites',
          operationId: 'getPendingInvites',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              invites: z.array(
                z.object({
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
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId();

        const user = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });

        if (!user) {
          throw new BadRequestError('User not found');
        }

        const pendingInvites = await db
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
          .where(eq(invites.email, user.email));
        return {
          invites: pendingInvites,
        };
      },
    );
}
