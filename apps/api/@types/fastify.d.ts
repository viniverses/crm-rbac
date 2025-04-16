import 'fastify';

import { Member, Organization } from '@/db/schema';

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>;
    getUserMemberships(
      slug: string,
    ): Promise<{ organization: Organization; membership: Member }>;
  }
}
