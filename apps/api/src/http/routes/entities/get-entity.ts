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

export async function getEntity(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/entities/:entitySlug',
      {
        schema: {
          tags: ['Entities'],
          summary: 'Get an entity',
          operationId: 'getEntity',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
            entitySlug: z.string(),
          }),
          response: {
            200: z.object({
              entity: z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                relationships: relationshipSchema,
                fields: fieldSchema,
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug, entitySlug } = request.params;

        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('get', 'Entity')) {
          throw new UnauthorizedError(`You're not allowed to get this entity.`);
        }

        const entity = await db.query.entities.findFirst({
          where: and(eq(entities.slug, entitySlug), eq(entities.organizationId, organization.id)),
        });

        if (!entity) {
          throw new NotFoundError(`Entity not found.`);
        }

        return {
          entity: {
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
            relationships: [],
            fields: entity.fields,
          },
        };
      },
    );
}
