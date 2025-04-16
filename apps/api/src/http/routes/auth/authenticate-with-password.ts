import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { users } from '@/db/schema';

import { BadRequestError } from '../errors/bad-request-error';

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/password',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with e-mail & password',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const userFromEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!userFromEmail) {
        throw new BadRequestError('Invalid credentials.');
      }

      if (userFromEmail.passwordHash === null) {
        throw new BadRequestError('User does not have a password.');
      }

      const isPasswordValid = await compare(
        password,
        userFromEmail.passwordHash,
      );

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid credentials.');
      }

      const token = app.jwt.sign(
        {
          sub: userFromEmail.id,
        },
        { expiresIn: '7d' },
      );

      return reply.status(201).send({ token });
    },
  );
}
