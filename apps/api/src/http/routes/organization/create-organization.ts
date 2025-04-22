import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { members, organizations } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { createSlug } from '@/utils/create-slug';

import { BadRequestError } from '../errors/bad-request-error';

export async function createOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations',
      {
        schema: {
          tags: ['Organizations'],
          summary: 'Create a new organization',
          operationId: 'createOrganization',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
            avatarUrl: z.string().nullish(),
          }),
          response: {
            201: z.object({
              organizationId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const { name, domain, shouldAttachUsersByDomain, avatarUrl } = request.body;

        if (domain) {
          const organizationWithSameDomain = await db.query.organizations.findFirst({
            where: eq(organizations.domain, domain),
          });

          if (organizationWithSameDomain) {
            throw new BadRequestError('Domain already in use');
          }
        }

        try {
          await db.transaction(async (tx) => {
            const [organization] = await tx
              .insert(organizations)
              .values({
                name,
                domain,
                slug: createSlug(name),
                shouldAttachUsersByDomain,
                ownerId: userId,
                avatarUrl,
              })
              .returning();

            await tx.insert(members).values({
              organizationId: organization.id,
              userId,
              role: 'ADMIN',
            });

            return reply.status(201).send({
              organizationId: organization.id,
            });
          });
        } catch (error) {
          throw new BadRequestError('Failed to create organization');
        }
      },
    );
}
