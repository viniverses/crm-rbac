import { roleSchema } from '@crm/auth';
import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { members, organizations } from '@/db/schema';
import { auth } from '@/middlewares/auth';

import { NotFoundError } from '../errors/not-found-error';

export async function getOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get organization by slug',
          operationId: 'getOrganization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              organization: z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                role: roleSchema,
                domain: z.string().nullable(),
                shouldAttachUsersByDomain: z.boolean(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;

        const userId = await request.getCurrentUserId();

        const [data] = await db
          .select({
            id: organizations.id,
            name: organizations.name,
            slug: organizations.slug,
            avatarUrl: organizations.avatarUrl,
            role: members.role,
            domain: organizations.domain,
            shouldAttachUsersByDomain: organizations.shouldAttachUsersByDomain,
            createdAt: organizations.createdAt,
            updatedAt: organizations.updatedAt,
          })
          .from(organizations)
          .innerJoin(members, and(eq(organizations.id, members.organizationId), eq(members.userId, userId)))
          .where(eq(organizations.slug, slug));

        if (!data) {
          throw new NotFoundError('Organization not found');
        }

        return { organization: data };
      },
    );
}
