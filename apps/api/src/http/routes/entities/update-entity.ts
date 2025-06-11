import { and, eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { entities } from '@/db/schema/entities';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { NotFoundError } from '../errors/not-found-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { fieldSchema, relationshipSchema } from './schema';

export async function updateEntity(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug/entities/:id',
      {
        schema: {
          tags: ['Entities'],
          summary: 'Update an entity',
          operationId: 'updateEntity',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            relationships: relationshipSchema,
            fields: fieldSchema,
          }),
          params: z.object({
            slug: z.string(),
            id: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, id } = request.params;

        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('update', 'Entity')) {
          throw new UnauthorizedError(`You're not allowed to update this entity.`);
        }

        const { name, fields } = request.body;

        const entity = await db.query.entities.findFirst({
          where: and(eq(entities.id, id), eq(entities.organizationId, organization.id)),
        });

        if (!entity) {
          throw new NotFoundError('Entity not found.');
        }

        await db
          .update(entities)
          .set({
            name,
            fields,
            updatedAt: new Date(),
            updatedBy: userId,
          })
          .where(eq(entities.id, id));

        return reply.status(204).send();
      },
    );
}
