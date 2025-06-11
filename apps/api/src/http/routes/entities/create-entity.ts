import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { entities } from '@/db/schema/entities';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../errors/bad-request-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { fieldSchema, relationshipSchema } from './schema';

export async function createEntity(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/entities',
      {
        schema: {
          tags: ['Entities'],
          summary: 'Create an entity',
          operationId: 'createEntity',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            slug: z.string().regex(/^[a-zA-Z_][a-zA-Z_]*$/),
            relationships: relationshipSchema,
            fields: fieldSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              tableSlug: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;

        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('create', 'Entity')) {
          throw new UnauthorizedError(`You're not allowed to create new entities.`);
        }

        const { name, fields, slug: tableSlug } = request.body;

        const entityWithSameSlug = await db.query.entities.findFirst({
          where: eq(entities.slug, tableSlug),
        });

        if (entityWithSameSlug) {
          throw new BadRequestError('Entity with same id/slug already exists.');
        }

        const [entity] = await db
          .insert(entities)
          .values({
            name,
            slug: tableSlug,
            fields,
            organizationId: organization.id,
            createdBy: userId,
          })
          .returning();

        return reply.status(201).send({
          tableSlug: entity.slug,
        });
      },
    );
}
