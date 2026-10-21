import { Controller, Get } from '@nestjs/common';

import type { AdminUser } from '../../infra/database/schema.ts';
import { AdminUsersService } from './admin-users.service.ts';

@Controller('admin-users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  findAll(): Promise<AdminUser[]> {
    return this.adminUsersService.findAll();
  }
}
