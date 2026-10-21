import { INestApplication, ValidationPipe } from '@nestjs/common';
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
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('/admin-users (GET)', () => {
    return request(app.getHttpServer()).get('/admin-users').expect(200).expect('Content-Type', /json/);
  });

  it('rejects a non-string email with a validation error', () => {
    return request(app.getHttpServer())
      .post('/admin-users')
      .send({ name: 'Maria Silva', email: 123, password: 'Strong#Pass1', status: 'active' })
      .expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});
