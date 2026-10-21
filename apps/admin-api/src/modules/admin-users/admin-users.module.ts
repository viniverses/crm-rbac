import { Module } from '@nestjs/common';

import { HashingModule } from '../../common/hashing/hashing.module.ts';
import { AdminUsersController } from './admin-users.controller.ts';
import { AdminUsersRepository } from './admin-users.repository.ts';
import { AdminUsersService } from './admin-users.service.ts';

@Module({
  imports: [HashingModule],
  controllers: [AdminUsersController],
  providers: [AdminUsersService, AdminUsersRepository],
})
export class AdminUsersModule {}
