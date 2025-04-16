import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

import { UnauthorizedError } from '@/http/routes/errors/unauthorized-error';

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>();
        console.log(sub);

        return sub;
      } catch (error) {
        console.log(error);
        throw new UnauthorizedError('Invalid auth token.');
      }
    };
  });
});
