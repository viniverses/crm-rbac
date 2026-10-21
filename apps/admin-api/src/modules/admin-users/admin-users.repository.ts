import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';

import type { Database } from '../../infra/database/database.ts';
import { adminUsers, type NewAdminUser } from '../../infra/database/schema.ts';

const adminUserResponseColumns = {
  id: adminUsers.id,
  name: adminUsers.name,
  email: adminUsers.email,
  status: adminUsers.status,
  createdAt: adminUsers.createdAt,
};

@Injectable()
export class AdminUsersRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  findAll() {
    return this.db.select(adminUserResponseColumns).from(adminUsers);
  }

  async create(input: NewAdminUser) {
    const [user] = await this.db
      .insert(adminUsers)
      .values(input)
      .onConflictDoNothing({ target: adminUsers.email })
      .returning(adminUserResponseColumns);

    return user;
  }
}
