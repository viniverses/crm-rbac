import { roleSchema } from '@crm/auth';
import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { invites, organizations, users } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { UnauthorizedError } from '../errors/unauthorized-error';

export async function getInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Get invites by organization',
          operationId: 'getInvites',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
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
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('get', 'Invite')) {
          throw new UnauthorizedError(`You're not allowed to get invites for this organization.`);
        }

        const organizationInvites = await db
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
          .where(eq(invites.organizationId, organization.id));

        return {
          invites: organizationInvites,
        };
      },
    );
}
