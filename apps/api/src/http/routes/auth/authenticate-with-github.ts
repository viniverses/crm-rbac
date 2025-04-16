import { env } from '@crm/env';
import { and, eq } from 'drizzle-orm';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { accounts, users } from '@/db/schema';

import { BadRequestError } from '../errors/bad-request-error';

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Authenticate with GitHub',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body;

      const githubOAuthURL = new URL(
        'https://github.com/login/oauth/access_token',
      );

      githubOAuthURL.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      githubOAuthURL.searchParams.set(
        'redirect_uri',
        env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,
      );
      githubOAuthURL.searchParams.set(
        'client_secret',
        env.GITHUB_CLIENT_SECRET,
      );
      githubOAuthURL.searchParams.set('code', code);

      const githubAccessTokenResponse = await fetch(githubOAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      });

      const githubAccessTokenData = await githubAccessTokenResponse.json();

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('bearer'),
          scope: z.string(),
        })
        .parse(githubAccessTokenData);

      const githubUserResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      });

      const githubUserData = await githubUserResponse.json();

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number().int().transform(String),
          avatar_url: z.string().url(),
          name: z.string().nullable(),
          email: z.string().nullable(),
        })
        .parse(githubUserData);

      if (!email) {
        throw new BadRequestError(
          'Your GitHub account must have an email to authenticate.',
        );
      }

      let user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        [user] = await db
          .insert(users)
          .values({
            email,
            name,
            avatarUrl,
          })
          .returning();
      }

      let account = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.userId, user.id),
          eq(accounts.provider, 'github'),
        ),
      });

      if (!account) {
        [account] = await db
          .insert(accounts)
          .values({
            userId: user.id,
            providerAccountId: githubId,
            provider: 'github',
          })
          .returning();
      }

      const token = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

      return reply.status(201).send({ token });
    },
  );
}
