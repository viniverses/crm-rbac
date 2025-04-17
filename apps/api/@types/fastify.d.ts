import 'fastify';

import { Member, Organization } from '@/db/schema';

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>;
    getUserMembership(slug: string): Promise<{ organization: Organization; membership: Member }>;
  }
}
