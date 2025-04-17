import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { projects, users } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { UnauthorizedError } from '../errors/unauthorized-error';

export async function getProjects(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get projects by organization',
          operationId: 'getProjects',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
          }),
          response: {
            200: z.object({
              projects: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  description: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  owner: z.object({
                    id: z.string().uuid(),
                    name: z.string().nullable(),
                    avatarUrl: z.string().url().nullable(),
                  }),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug } = request.params;
        const userId = await request.getCurrentUserId();

        const { organization, membership } = await request.getUserMembership(orgSlug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(`You're not allowed to get organization projects.`);
        }

        const organizationProjects = await db
          .select({
            id: projects.id,
            name: projects.name,
            slug: projects.slug,
            description: projects.description,
            avatarUrl: projects.avatarUrl,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
            owner: {
              id: users.id,
              name: users.name,
              avatarUrl: users.avatarUrl,
            },
          })
          .from(projects)
          .innerJoin(users, eq(projects.ownerId, users.id))
          .where(eq(projects.organizationId, organization.id));

        return reply.send({
          projects: organizationProjects,
        });
      },
    );
}
