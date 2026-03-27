import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { SongsModule } from '../src/songs/songs.module';

/**
 * E2E tests: HTTP layer + MongoDB (in-memory) + Songs module.
 * Full app e2e would require all modules; we test a focused slice for stability.
 */
describe('Songs API (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(uri),
        SongsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
    if (mongoServer) await mongoServer.stop();
  });

  it('GET /api/songs/stats returns JSON with platform fields', () => {
    return request(app.getHttpServer())
      .get('/api/songs/stats')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('totalSongs');
        expect(res.body).toHaveProperty('totalStreams');
      });
  });

  it('GET /api/songs/count returns a numeric count', () => {
    return request(app.getHttpServer())
      .get('/api/songs/count')
      .expect(200)
      .expect((res) => {
        const n = typeof res.body === 'number' ? res.body : Number(res.text);
        expect(Number.isFinite(n)).toBe(true);
        expect(n).toBeGreaterThanOrEqual(0);
      });
  });
});
