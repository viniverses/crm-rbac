import { and, eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import { db } from '@/db/drizzle';
import { members, organizations } from '@/db/schema';
import { UnauthorizedError } from '@/http/routes/errors/unauthorized-error';

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>();
        console.log(sub);

        return sub;
      } catch (error) {
        throw new UnauthorizedError('Invalid auth token.');
      }
    };

    request.getUserMembership = async (slug: string) => {
      const userId = await request.getCurrentUserId();

      const [member] = await db
        .select()
        .from(members)
        .innerJoin(organizations, eq(members.organizationId, organizations.id))
        .where(and(eq(members.userId, userId), eq(organizations.slug, slug)))
        .limit(1);

      console.log(member);

      if (!member) {
        throw new UnauthorizedError(
          'User is not a member of this organization.',
        );
      }

      return {
        organization: member.organizations,
        membership: member.members,
      };
    };
  });
});
