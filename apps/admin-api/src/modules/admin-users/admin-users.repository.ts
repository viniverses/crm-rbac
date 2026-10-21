import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';

import type { Database } from '../../infra/database/database.ts';
import { type AdminUser,adminUsers } from '../../infra/database/schema.ts';

@Injectable()
export class AdminUsersRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  findAll(): Promise<AdminUser[]> {
    return this.db.select().from(adminUsers);
  }
}
