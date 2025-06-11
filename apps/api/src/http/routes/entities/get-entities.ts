import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { entities } from '@/db/schema/entities';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { UnauthorizedError } from '../errors/unauthorized-error';
import { fieldSchema, relationshipSchema } from './schema';

export async function getEntities(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/entities',
      {
        schema: {
          tags: ['Entities'],
          summary: 'Get all entities',
          operationId: 'getEntities',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              entities: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  relationships: relationshipSchema,
                  fields: fieldSchema,
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

        if (cannot('get', 'Entity')) {
          throw new UnauthorizedError(`You're not allowed to get this entity.`);
        }

        const entitiesData = await db.query.entities.findMany({
          where: eq(entities.organizationId, organization.id),
        });

        const entitiesResponse = entitiesData.map((entity) => ({
          id: entity.id,
          name: entity.name,
          slug: entity.slug,
          relationships: [],
          fields: entity.fields,
        }));

        return { entities: entitiesResponse };
      },
    );
}
