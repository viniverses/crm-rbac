import { Module } from '@nestjs/common';

import { AdminUsersController } from './admin-users.controller.ts';
import { AdminUsersRepository } from './admin-users.repository.ts';
import { AdminUsersService } from './admin-users.service.ts';

@Module({
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AdminUsersRepository],
})
export class AdminUsersModule {}
