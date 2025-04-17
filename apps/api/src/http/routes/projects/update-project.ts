import { projectSchema } from '@crm/auth';
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

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/projects/:projectId',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Update a project',
          operationId: 'updateProject',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
            avatarUrl: z.string().url().nullable(),
          }),
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params;
        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const project = await db.query.projects.findFirst({
          where: and(eq(projects.id, projectId), eq(projects.organizationId, organization.id)),
        });

        if (!project) {
          throw new NotFoundError('Project not found');
        }

        const { cannot } = getUserPermissions(userId, membership.role);
        const authProject = projectSchema.parse(project);

        if (cannot('update', authProject)) {
          throw new UnauthorizedError(`You're not allowed to update this project.`);
        }

        const { name, description, avatarUrl } = request.body;

        await db
          .update(projects)
          .set({ name, description, avatarUrl, updatedAt: new Date() })
          .where(eq(projects.id, project.id));

        return reply.status(204).send();
      },
    );
}
