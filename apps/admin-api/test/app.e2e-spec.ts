import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from './../src/app.module.ts';

describe('AdminUsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/admin-users (GET)', () => {
    return request(app.getHttpServer()).get('/admin-users').expect(200).expect('Content-Type', /json/);
  });

  afterEach(async () => {
    await app.close();
  });
});
