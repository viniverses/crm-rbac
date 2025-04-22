import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@crm/env';
import { eq } from 'drizzle-orm';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { files } from '@/db/schema';
import { s3Client } from '@/http/lib/cloudflare';
import { auth } from '@/middlewares/auth';

import { NotFoundError } from '../errors/not-found-error';

export async function getFile(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/uploads/:id',
      {
        schema: {
          tags: ['Upload'],
          summary: 'Get file',
          operationId: 'getFile',
          security: [{ bearerAuth: [] }],
          params: z.object({
            id: z.string().uuid(),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              signedUrl: z.string(),
            }),
          },
        },
      },
      async (request) => {
        const { id } = request.params;

        const file = await db.query.files.findFirst({
          where: eq(files.id, id),
        });

        if (!file) {
          throw new NotFoundError('File not found');
        }

        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({ Bucket: env.CLOUDFLARE_BUCKET, Key: file.key }),
        );

        return { id: file.id, signedUrl };
      },
    );
}
