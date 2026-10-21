import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { HashingService } from '../../common/hashing/hashing.service.ts';
import { AdminUsersRepository } from './admin-users.repository.ts';
import { AdminUsersService } from './admin-users.service.ts';
import type { CreateAdminUserDto } from './dto/create-admin-user.ts';

const input: CreateAdminUserDto = {
  name: 'John Doe',
  email: 'john@eacme.com',
  password: 'Strong#Pass1',
  status: 'active',
};

describe('AdminUsersService', () => {
  it('hashes the password and returns a user without the hash', async () => {
    const user = {
      id: 'b58d856c-e720-49c4-9c34-2c3f10f7fd4e',
      name: input.name,
      email: input.email,
      status: input.status,
      createdAt: new Date(),
    };
    const create = vi.fn().mockResolvedValue(user);
    const hash = vi.fn().mockResolvedValue('hashed-password');
    const module = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        { provide: HashingService, useValue: { hash } },
        { provide: AdminUsersRepository, useValue: { create } },
      ],
    }).compile();
    const service = module.get(AdminUsersService);

    await expect(service.create(input)).resolves.toEqual(user);
    const saved = create.mock.calls[0]?.[0];
    expect(saved).toBeDefined();
    expect(hash).toHaveBeenCalledExactlyOnceWith(input.password);
    expect(saved.passwordHash).toBe('hashed-password');
    expect(saved).not.toHaveProperty('password');
  });

  it('rejects a duplicate email', async () => {
    const module = await Test.createTestingModule({
      providers: [
        AdminUsersService,
        { provide: HashingService, useValue: { hash: vi.fn().mockResolvedValue('hashed-password') } },
        { provide: AdminUsersRepository, useValue: { create: vi.fn().mockResolvedValue(undefined) } },
      ],
    }).compile();

    await expect(module.get(AdminUsersService).create(input)).rejects.toBeInstanceOf(ConflictException);
  });
});
