import { randomUUID } from 'node:crypto';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '@crm/env';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

import { db } from '@/db/drizzle';
import { files } from '@/db/schema';
import { s3Client } from '@/http/lib/cloudflare';
import { auth } from '@/middlewares/auth';

export async function getPreSignedUrl(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/uploads/get-presigned-url',
      {
        schema: {
          tags: ['Upload'],
          summary: 'Get pre-signed url',
          operationId: 'getPreSignedUrl',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string().min(1),
            contentType: z
              .string()
              .min(1)
              .regex(/^[a-zA-Z0-9!#$&^_\-+.]+\/[a-zA-Z0-9!#$&^_\-+.]+$/, {
                message: 'Invalid content type format. Must be in the format type/subtype',
              }),
          }),
          response: {
            200: z.object({
              id: z.string().uuid(),
              publicUrl: z.string().url(),
              signedUrl: z.string(),
            }),
          },
        },
      },
      async (request) => {
        const userId = await request.getCurrentUserId();
        const { name, contentType } = request.body;

        const fileExtension = name.split('.').pop();
        const fileKey = `${randomUUID()}.${fileExtension}`;

        const signedUrl = await getSignedUrl(
          s3Client,
          new PutObjectCommand({
            Bucket: env.CLOUDFLARE_BUCKET,
            Key: fileKey,
            ContentType: contentType,
          }),
          {
            expiresIn: 60 * 60 * 24 * 2, // 2 days
          },
        );

        const [file] = await db
          .insert(files)
          .values({
            name,
            key: fileKey,
            userId,
          })
          .returning({ id: files.id });

        const publicUrl = `${env.CLOUDFLARE_PUBLIC_URL}/${env.CLOUDFLARE_BUCKET}/${fileKey}`;

        return {
          id: file.id,
          signedUrl,
          publicUrl,
        };
      },
    );
}
