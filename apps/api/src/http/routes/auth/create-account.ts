import { hash } from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { members, organizations, users } from '@/db/schema';

import { BadRequestError } from '../errors/bad-request-error';

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        operationId: 'createAccount',
        summary: 'Create a new user',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            userId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body;

      const userWithSameEmail = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (userWithSameEmail) {
        throw new BadRequestError('User already exists.');
      }

      const [, domain] = email.split('@');

      const autoJoinOrganization = await db.query.organizations.findFirst({
        where: and(eq(organizations.domain, domain), eq(organizations.shouldAttachUsersByDomain, true)),
      });

      const passwordHash = await hash(password, 6);

      const [user] = await db
        .insert(users)
        .values({
          name,
          email,
          passwordHash,
        })
        .returning();

      if (autoJoinOrganization) {
        await db.insert(members).values({
          userId: user.id,
          organizationId: autoJoinOrganization.id,
        });
      }

      return reply.status(201).send({
        userId: user.id,
      });
    },
  );
}
