import { roleSchema } from '@crm/auth';
import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { auth } from '@/middlewares/auth';

import { NotFoundError } from '../errors/not-found-error';

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/organizations/:slug/membership',
      {
        schema: {
          tags: ['Organizations'],
          operationId: 'getMembership',
          summary: 'Get the membership of the current user in the organization',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string(),
                role: roleSchema,
                organizationId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request) => {
        const { slug } = request.params;
        const { membership } = await request.getUserMembership(slug);

        if (!membership) {
          throw new NotFoundError('Membership not found');
        }

        return {
          membership: {
            id: membership.id,
            organizationId: membership.organizationId,
            userId: membership.userId,
            role: membership.role,
          },
        };
      },
    );
}
