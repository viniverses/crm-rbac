import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AdminUsersService } from './admin-users.service.ts';
import { AdminUserResponseDto } from './dto/admin-user-response.ts';
import { CreateAdminUserDto } from './dto/create-admin-user.ts';

@Controller('admin-users')
@ApiTags('Admin users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({
    summary: 'List admin users',
    description: 'Returns the admin users without their password hashes.',
  })
  @ApiOkResponse({ description: 'Admin users found.', type: AdminUserResponseDto, isArray: true })
  findAll(): Promise<AdminUserResponseDto[]> {
    return this.adminUsersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create an admin user',
    description: 'Creates an admin user and stores a hash of the supplied password.',
  })
  @ApiCreatedResponse({ description: 'Admin user created.', type: AdminUserResponseDto })
  create(@Body() createAdminUserDto: CreateAdminUserDto): Promise<AdminUserResponseDto> {
    return this.adminUsersService.create(createAdminUserDto);
  }
}
