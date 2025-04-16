import { addDays } from 'date-fns';
import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { users } from '@/db/schema';

import { BadRequestError } from '../errors/bad-request-error';
import { tokens } from './../../../db/schema/tokens';

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/recover',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Request password recover',
        body: z.object({
          email: z.string().email(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email } = request.body;

      const userFromEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!userFromEmail) {
        throw new BadRequestError('User not found.');
      }

      await db.insert(tokens).values({
        userId: userFromEmail.id,
        type: 'PASSWORD_RECOVER',
        expiresAt: addDays(new Date(), 1),
      });

      return reply.status(201).send();
    },
  );
}
