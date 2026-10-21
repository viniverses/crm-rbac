import { Test } from '@nestjs/testing';

import type { AdminUser } from '../../infra/database/schema.ts';
import { AdminUsersController } from './admin-users.controller.ts';
import { AdminUsersService } from './admin-users.service.ts';

describe('AdminUsersController', () => {
  it('returns the admin users from the service', async () => {
    const users: AdminUser[] = [];
    const findAll = vi.fn().mockResolvedValue(users);
    const module = await Test.createTestingModule({
      controllers: [AdminUsersController],
      providers: [{ provide: AdminUsersService, useValue: { findAll } }],
    }).compile();
    const controller = module.get(AdminUsersController);

    await expect(controller.findAll()).resolves.toBe(users);
    expect(findAll).toHaveBeenCalledOnce();
  });
});
