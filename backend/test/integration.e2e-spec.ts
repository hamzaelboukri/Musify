import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { PlaylistsModule } from '../src/playlists/playlists.module';
import { FavoritesModule } from '../src/favorites/favorites.module';
import { SongsModule } from '../src/songs/songs.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';

/**
 * Tests d'intégration frontend-backend :
 * - Connexion (register, login)
 * - Playlists (création, liste, ajout de chanson)
 * - Favoris
 * - Liste des chansons (lecture)
 */
describe('Integration Frontend-Backend (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    process.env.MONGODB_URI = uri;
    process.env.JWT_SECRET = 'integration-test-secret';
    process.env.JWT_REFRESH_SECRET = 'integration-test-refresh-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(uri),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'integration-test-secret',
          signOptions: { expiresIn: '1h' },
        }),
        AuthModule,
        PlaylistsModule,
        FavoritesModule,
        SongsModule,
      ],
      providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
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

  describe('1. Auth - Connexion', () => {
    it('POST /api/auth/register crée un utilisateur et retourne les tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'test@musify.com',
          password: 'password123',
          name: 'Test User',
          role: 'USER',
        })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toBe('test@musify.com');

      accessToken = res.body.accessToken;
      userId = res.body.user.id || res.body.user._id;
    });

    it('POST /api/auth/login authentifie et retourne les tokens', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@musify.com', password: 'password123' })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('user');
      accessToken = res.body.accessToken;
    });

    it('POST /api/auth/login rejette un mot de passe incorrect', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@musify.com', password: 'wrongpassword' })
        .expect(401);
    });
  });

  describe('2. Songs - Lecture / Catalogue', () => {
    it('GET /api/songs retourne une liste (vide ou avec chansons)', () => {
      return request(app.getHttpServer())
        .get('/api/songs')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('GET /api/songs/stats retourne les stats de la plateforme', () => {
      return request(app.getHttpServer())
        .get('/api/songs/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalSongs');
          expect(res.body).toHaveProperty('totalStreams');
        });
    });
  });

  describe('3. Playlists', () => {
    let playlistId: string;

    it('GET /api/playlists sans token retourne 401', () => {
      return request(app.getHttpServer()).get('/api/playlists').expect(401);
    });

    it('POST /api/playlists crée une playlist avec token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/playlists')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Ma Playlist Test' })
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Ma Playlist Test');
      playlistId = res.body._id;
    });

    it('GET /api/playlists retourne les playlists de l\'utilisateur', () => {
      return request(app.getHttpServer())
        .get('/api/playlists')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
          expect(res.body[0].name).toBe('Ma Playlist Test');
        });
    });
  });

  describe('4. Favoris', () => {
    it('GET /api/favorites sans token retourne 401', () => {
      return request(app.getHttpServer()).get('/api/favorites').expect(401);
    });

    it('GET /api/favorites avec token retourne un tableau', () => {
      return request(app.getHttpServer())
        .get('/api/favorites')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
