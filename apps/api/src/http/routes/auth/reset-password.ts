import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { users } from '@/db/schema';

import { UnauthorizedError } from '../errors/unauthorized-error';
import { tokens } from './../../../db/schema/tokens';

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Reset password from recover code',
        body: z.object({
          code: z.string().uuid(),
          password: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body;

      const tokenFromCode = await db.query.tokens.findFirst({
        where: eq(tokens.id, code),
      });

      if (!tokenFromCode) {
        throw new UnauthorizedError('Invalid code.');
      }

      if (tokenFromCode.expiresAt < new Date()) {
        throw new UnauthorizedError('Token expired.');
      }

      const passwordHash = await hash(password, 6);

      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            passwordHash,
          })
          .where(eq(users.id, tokenFromCode.userId));

        await tx.delete(tokens).where(eq(tokens.id, code));
      });

      return reply.status(204).send();
    },
  );
}
