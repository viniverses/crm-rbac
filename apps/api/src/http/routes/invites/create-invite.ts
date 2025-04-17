import { roleSchema } from '@crm/auth';
import { and, eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { invites, members, users } from '@/db/schema';
import { auth } from '@/middlewares/auth';
import { getUserPermissions } from '@/utils/get-user-permissions';

import { BadRequestError } from '../errors/bad-request-error';
import { UnauthorizedError } from '../errors/unauthorized-error';

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Create an invite',
          operationId: 'createInvite',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;

        const userId = await request.getCurrentUserId();
        const { organization, membership } = await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(`You're not allowed to create new invites.`);
        }

        const { email, role } = request.body;

        const [, domain] = email.split('@');

        if (organization.shouldAttachUsersByDomain && domain !== organization.domain) {
          throw new BadRequestError(
            `Cannot create invite. Users with "${domain}" domain will join automatically on login.`,
          );
        }

        const inviteWithSameEmail = await db.query.invites.findFirst({
          where: and(eq(invites.email, email), eq(invites.organizationId, organization.id)),
        });

        if (inviteWithSameEmail) {
          throw new BadRequestError('User already invited to this organization.');
        }

        const [memberWithSameEmail] = await db
          .select()
          .from(members)
          .innerJoin(users, eq(members.userId, users.id))
          .where(and(eq(users.email, email), eq(members.organizationId, organization.id)));

        if (memberWithSameEmail) {
          throw new BadRequestError('This user is already a member of your organization.');
        }

        const [invite] = await db
          .insert(invites)
          .values({
            email,
            role,
            organizationId: organization.id,
            authorId: userId,
          })
          .returning();

        return reply.status(201).send({
          inviteId: invite.id,
        });
      },
    );
}
