import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { NotFoundError } from '../errors/not-found-error';
import { UnauthorizedError } from '../errors/unauthorized-error';

export async function getProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:orgSlug/projects/:projectSlug',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Get a project',
          operationId: 'getProject',
          security: [{ bearerAuth: [] }],
          params: z.object({
            orgSlug: z.string(),
            projectSlug: z.string(),
          }),
          response: {
            200: z.object({
              project: z.object({
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
            }),
          },
        },
      },
      async (request, reply) => {
        const { orgSlug, projectSlug } = request.params;
        const userId = await request.getCurrentUserId();

        const { organization, membership } = await request.getUserMembership(orgSlug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('get', 'Project')) {
          throw new UnauthorizedError(`You're not allowed to get this project.`);
        }

        const project = await db.query.projects.findFirst({
          where: and(eq(projects.slug, projectSlug), eq(projects.organizationId, organization.id)),
          with: {
            owner: true,
          },
        });

        if (!project) {
          throw new NotFoundError('Project not found');
        }

        return reply.send({
          project: {
            id: project.id,
            name: project.name,
            slug: project.slug,
            description: project.description,
            avatarUrl: project.avatarUrl,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            owner: {
              id: project.ownerId,
              name: project.owner.name,
              avatarUrl: project.owner.avatarUrl,
            },
          },
        });
      },
    );
}
