import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { createSlug } from '@/utils/create-slug';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { UnauthorizedError } from '../errors/unauthorized-error';

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/projects',
      {
        schema: {
          tags: ['Projects'],
          summary: 'Create a project',
          operationId: 'createProject',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const userId = await request.getCurrentUserId();

        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(`You're not allowed to create new projects.`);
        }

        const { name, description } = request.body;

        const [project] = await db
          .insert(projects)
          .values({
            name,
            slug: createSlug(name),
            description,
            organizationId: organization.id,
            ownerId: userId,
          })
          .returning();

        return reply.status(201).send({
          projectId: project.id,
        });
      },
    );
}
