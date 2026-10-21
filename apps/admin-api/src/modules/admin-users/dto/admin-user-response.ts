import { ApiProperty } from '@nestjs/swagger';

import { adminUserStatus } from '../../../infra/database/schema.ts';

export class AdminUserResponseDto {
  @ApiProperty({
    title: 'ID',
    description: 'Unique identifier of the admin user.',
    format: 'uuid',
    example: 'b58d856c-e720-49c4-9c34-2c3f10f7fd4e',
  })
  id: string;

  @ApiProperty({ title: 'Name', description: 'Full name of the admin user.', example: 'Maria Silva' })
  name: string;

  @ApiProperty({
    title: 'Email',
    description: 'Email address of the admin user.',
    format: 'email',
    example: 'maria@example.com',
  })
  email: string;

  @ApiProperty({
    title: 'Status',
    description: 'Current status of the admin user.',
    enum: adminUserStatus.enumValues,
    enumName: 'AdminUserStatus',
    example: 'active',
  })
  status: (typeof adminUserStatus.enumValues)[number];

  @ApiProperty({
    title: 'Created at',
    description: 'Date and time when the admin user was created.',
    type: String,
    format: 'date-time',
    example: '2026-10-21T18:30:00.000Z',
  })
  createdAt: Date;
}
