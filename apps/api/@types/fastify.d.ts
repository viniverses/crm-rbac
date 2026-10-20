import 'fastify';

import { Member, Organization } from '@crm/db';

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>;
    getUserMembership(slug: string): Promise<{ organization: Organization; membership: Member }>;
  }
}
