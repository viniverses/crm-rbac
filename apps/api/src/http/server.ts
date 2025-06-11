import { env } from '@crm/env';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import { errorHandler } from './error-handler';
import { authenticateWithGithub } from './routes/auth/authenticate-with-github';
import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { createAccount } from './routes/auth/create-account';
import { getProfile } from './routes/auth/get-profile';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { resetPassword } from './routes/auth/reset-password';
import { getOrganizationBilling } from './routes/billing/get-organization-billing';
import { createEntity } from './routes/entities/create-entity';
import { getEntities } from './routes/entities/get-entities';
import { getEntity } from './routes/entities/get-entity';
import { updateEntity } from './routes/entities/update-entity';
import { acceptInvite } from './routes/invites/accept-invite';
import { createInvite } from './routes/invites/create-invite';
import { getInvite } from './routes/invites/get-invite';
import { getInvites } from './routes/invites/get-invites';
import { getPendingInvites } from './routes/invites/get-pending-invites';
import { rejectInvite } from './routes/invites/reject-invite';
import { deleteMember } from './routes/members/delete-member';
import { getMembers } from './routes/members/get-members';
import { updateMember } from './routes/members/update-member';
import { createOrganization } from './routes/organization/create-organization';
import { getMembership } from './routes/organization/get-membership';
import { getOrganization } from './routes/organization/get-organization';
import { getOrganizations } from './routes/organization/get-organizations';
import { shutdownOrganization } from './routes/organization/shutdown-organization';
import { transferOrganization } from './routes/organization/transfer-organization';
import { updateOrganization } from './routes/organization/update-organization';
import { createProject } from './routes/projects/create-project';
import { deleteProject } from './routes/projects/delete-project';
import { getProject } from './routes/projects/get-project';
import { getProjects } from './routes/projects/get-projects';
import { updateProject } from './routes/projects/update-project';
import { getFile } from './routes/uploads/get-file';
import { getPreSignedUrl } from './routes/uploads/get-pre-signed-url';

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

app.get('/openapi.json', async () => {
  return app.swagger();
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

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
});

// Auth
app.register(fastifyCors);
app.register(createAccount);
app.register(authenticateWithPassword);
app.register(authenticateWithGithub);
app.register(getProfile);
app.register(requestPasswordRecover);
app.register(resetPassword);

// Organizations
app.register(createOrganization);
app.register(getMembership);
app.register(getOrganization);
app.register(getOrganizations);
app.register(updateOrganization);
app.register(shutdownOrganization);
app.register(transferOrganization);

// Projects
app.register(createProject);
app.register(deleteProject);
app.register(getProject);
app.register(getProjects);
app.register(updateProject);

// Members
app.register(getMembers);
app.register(updateMember);
app.register(deleteMember);

// Invites
app.register(createInvite);
app.register(getInvite);
app.register(getInvites);
app.register(acceptInvite);
app.register(rejectInvite);
app.register(getPendingInvites);

// Billing
app.register(getOrganizationBilling);

// Uploads
app.register(getPreSignedUrl);
app.register(getFile);

// Entities
app.register(createEntity);
app.register(getEntity);
app.register(updateEntity);
app.register(getEntities);

app.listen({ port: env.PORT, host: '0.0.0.0' }).then((address) => {
  console.log(`🔥 HTTP server running at ${address}`);
});
