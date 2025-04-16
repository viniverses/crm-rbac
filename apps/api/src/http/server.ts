import fastifyCors from '@fastify/cors';
import fastify from 'fastify';
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { createAccount } from './routes/auth/create-account';
import fastifySwagger from '@fastify/swagger';

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API',
      description: 'CRM API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
});

app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs',
  configuration: {
    title: 'Our API Reference',
    url: '/openapi.json',
  },
});

app.get('/openapi.json', async () => {
  return app.swagger();
});

app.register(fastifyCors);
app.register(createAccount);

app.listen({ port: 3000, host: '0.0.0.0' }).then((oi) => {
  console.log(`🔥 HTTP server running at ${oi}`);
});
