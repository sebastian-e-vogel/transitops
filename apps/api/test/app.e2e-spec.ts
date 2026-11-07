import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/configure-app.js';

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('GET /api/v1/health returns status ok', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET / is not served', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBe(404);
    expect(res.text).not.toContain('Hello World');
  });

  it('GET /api/v1 is not served', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1');
    expect(res.status).toBe(404);
    expect(res.text).not.toContain('Hello World');
  });

  afterEach(async () => {
    await app.close();
  });
});
