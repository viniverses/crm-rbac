import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

import { adminUserStatus } from '../../../infra/database/schema.ts';

export class CreateAdminUserDto {
  @ApiProperty({
    title: 'Name',
    description: 'Admin user name (5 to 50 characters).',
    example: 'Maria Silva',
    minLength: 5,
    maxLength: 50,
  })
  @IsNotEmpty()
  @Length(5, 50)
  name: string;

  @ApiProperty({
    title: 'Email',
    description: 'Admin user email address.',
    example: 'maria@example.com',
    format: 'email',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  email: string;

  @ApiProperty({
    title: 'Password',
    description: 'At least 8 characters, including a lowercase letter, an uppercase letter, a number, and a symbol.',
    example: 'Strong#Pass1',
    format: 'password',
    minLength: 8,
    writeOnly: true,
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.',
    },
  )
  password: string;

  @ApiProperty({
    title: 'Status',
    description: 'Initial status of the admin user.',
    enum: adminUserStatus.enumValues,
    enumName: 'AdminUserStatus',
    example: 'active',
  })
  @IsIn(adminUserStatus.enumValues, { message: 'Status must be "active" or "inactive".' })
  status: (typeof adminUserStatus.enumValues)[number];
}
