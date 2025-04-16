import { env } from '@crm/env';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { getMembership } from '@/utils/get-membership';

import { errorHandler } from './error-handler';
import { authenticateWithGithub } from './routes/auth/authenticate-with-github';
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { createAccount } from './routes/auth/create-account';
import { getProfile } from './routes/auth/get-profile';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { resetPassword } from './routes/auth/reset-password';
import { createOrganization } from './routes/organization/create-organization';
const app = fastify({
  logger: false,
}).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'CRM API',
      description: 'CRM API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs/v2',
  configuration: {
    url: '/openapi.json',
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs/v1',
});

app.get('/openapi.json', async () => {
  return app.swagger();
});

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
});

app.register(fastifyCors);
app.register(createAccount);
app.register(authenticateWithPassword);
app.register(authenticateWithGithub);
app.register(getProfile);
app.register(requestPasswordRecover);
app.register(resetPassword);

app.register(createOrganization);
app.register(getMembership);

app.listen({ port: env.SERVER_PORT, host: '0.0.0.0' }).then((address) => {
  console.log(`🔥 HTTP server running at ${address}`);
});
