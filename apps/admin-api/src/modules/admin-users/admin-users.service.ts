import { Injectable } from '@nestjs/common';

import type { AdminUser } from '../../infra/database/schema.ts';
import { AdminUsersRepository } from './admin-users.repository.ts';

@Injectable()
export class AdminUsersService {
  constructor(private readonly adminUsersRepository: AdminUsersRepository) {}

  findAll(): Promise<AdminUser[]> {
    return this.adminUsersRepository.findAll();
  }
}
