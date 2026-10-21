import { ConflictException, Injectable } from '@nestjs/common';

import { HashingService } from '../../common/hashing/hashing.service.ts';
import type { NewAdminUser } from '../../infra/database/schema.ts';
import { AdminUsersRepository } from './admin-users.repository.ts';

type CreateAdminUserInput = {
  name: string;
  email: string;
  status: NewAdminUser['status'];
  password: string;
};

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly adminUsersRepository: AdminUsersRepository,
    private readonly passwordHasher: HashingService,
  ) {}

  findAll() {
    return this.adminUsersRepository.findAll();
  }

  async create(input: CreateAdminUserInput) {
    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.adminUsersRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      status: input.status,
    });

    if (!user) {
      throw new ConflictException('An admin user with this email already exists.');
    }

    return user;
  }
}
