import { roleSchema } from '@crm/auth';
import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { members, organizations } from '@/db/schema';
import { auth } from '@/middlewares/auth';

export async function getOrganizations(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Get organizations of the current user',
          operationId: 'getOrganization',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              organizations: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().url().nullable(),
                  role: roleSchema,
                }),
              ),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId();

        const organizationsData = await db
          .select({
            id: organizations.id,
            name: organizations.name,
            slug: organizations.slug,
            avatarUrl: organizations.avatarUrl,
            role: members.role,
          })
          .from(organizations)
          .innerJoin(members, and(eq(organizations.id, members.organizationId), eq(members.userId, userId)));

        return { organizations: organizationsData };
      },
    );
}
