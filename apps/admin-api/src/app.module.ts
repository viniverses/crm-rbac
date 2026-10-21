import { Module } from '@nestjs/common';
import { DrizzleModule } from '@nestjs/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';

import { relations } from './infra/database/relations.ts';
import { AdminUsersModule } from './modules/admin-users/admin-users.module.ts';

@Module({
  imports: [
    DrizzleModule.forRoot({
      drizzle,
      connection: process.env.ADMIN_DATABASE_URL!,
      relations,
    }),
    AdminUsersModule,
  ],
})
export class AppModule {}
