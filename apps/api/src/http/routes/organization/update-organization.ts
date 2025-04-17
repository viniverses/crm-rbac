import { organizationSchema } from '@crm/auth';
import { and, eq, ne } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { organizations } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../errors/bad-request-error';
import { UnauthorizedError } from '../errors/unauthorized-error';

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Update an organization',
          operationId: 'updateOrganization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { name, domain, shouldAttachUsersByDomain } = request.body;

        const userId = await request.getCurrentUserId();
        const { membership, organization } = await request.getUserMembership(slug);

        const authOrganization = organizationSchema.parse(organization);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('update', authOrganization)) {
          throw new UnauthorizedError('You are not allowed to update this organization');
        }

        if (domain) {
          const organizationWithSameDomain = await db.query.organizations.findFirst({
            where: and(eq(organizations.domain, domain), ne(organizations.id, organization.id)),
          });

          if (organizationWithSameDomain) {
            throw new BadRequestError('Domain already in use');
          }
        }

        await db
          .update(organizations)
          .set({
            name,
            domain,
            shouldAttachUsersByDomain,
            updatedAt: new Date(),
          })
          .where(eq(organizations.id, organization.id));

        return reply.status(204).send();
      },
    );
}
