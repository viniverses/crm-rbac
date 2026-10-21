import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test } from '@nestjs/testing';

import { AdminUsersController } from './admin-users.controller.ts';
import { AdminUsersService } from './admin-users.service.ts';
import type { AdminUserResponseDto } from './dto/admin-user-response.ts';

describe('AdminUsersController', () => {
  it('returns the admin users from the service', async () => {
    const users: AdminUserResponseDto[] = [];
    const findAll = vi.fn().mockResolvedValue(users);
    const module = await Test.createTestingModule({
      controllers: [AdminUsersController],
      providers: [{ provide: AdminUsersService, useValue: { findAll } }],
    }).compile();
    const controller = module.get(AdminUsersController);

    await expect(controller.findAll()).resolves.toBe(users);
    expect(findAll).toHaveBeenCalledOnce();
  });

  it('documents both response schemas without the password hash', async () => {
    const module = await Test.createTestingModule({
      controllers: [AdminUsersController],
      providers: [{ provide: AdminUsersService, useValue: {} }],
    }).compile();
    const app = module.createNestApplication();
    await app.init();

    try {
      const document = SwaggerModule.createDocument(app, new DocumentBuilder().build());
      const getOperation = document.paths['/admin-users']?.get;
      const postOperation = document.paths['/admin-users']?.post;
      expect(getOperation?.summary).toBe('List admin users');
      expect(postOperation?.summary).toBe('Create an admin user');
      const getSchema = getOperation?.responses?.['200'];
      const postSchema = postOperation?.responses?.['201'];
      expect(getSchema).toBeDefined();
      expect(postSchema).toBeDefined();
      const responseSchema = document.components?.schemas?.AdminUserResponseDto;
      expect(responseSchema).toBeDefined();
      expect(JSON.stringify(responseSchema)).not.toContain('passwordHash');
      expect(responseSchema && 'properties' in responseSchema && responseSchema.properties?.email).toMatchObject({
        title: 'Email',
        description: 'Email address of the admin user.',
        example: 'maria@example.com',
      });
    } finally {
      await app.close();
    }
  });
});
