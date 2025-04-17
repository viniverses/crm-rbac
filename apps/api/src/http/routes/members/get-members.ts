import { roleSchema } from '@crm/auth';
import { asc, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { members, users } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { UnauthorizedError } from '../errors/unauthorized-error';

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/members',
      {
        schema: {
          tags: ['Members'],
          summary: 'Get members by organization',
          operationId: 'getMembers',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string().uuid(),
                  userId: z.string().uuid(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.string().email(),
                  avatarUrl: z.string().url().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();

        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('get', 'User')) {
          throw new UnauthorizedError(`You're not allowed to get organization members.`);
        }

        const organizationMembers = await db
          .select({
            id: members.id,
            userId: members.userId,
            role: members.role,
            name: users.name,
            email: users.email,
            avatarUrl: users.avatarUrl,
          })
          .from(members)
          .innerJoin(users, eq(members.userId, users.id))
          .where(eq(members.organizationId, organization.id))
          .orderBy(asc(members.role));

        return reply.send({
          members: organizationMembers,
        });
      },
    );
}
