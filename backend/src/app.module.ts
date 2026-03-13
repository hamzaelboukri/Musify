import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SingersModule } from './singers/singers.module';
import { AdminModule } from './admin/admin.module';
import { SongsModule } from './songs/songs.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SessionsModule } from './sessions/sessions.module';
import { StreamingModule } from './streaming/streaming.module';
import { StatsModule } from './stats/stats.module';
import { UploadModule } from './upload/upload.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/musify'),
    AuthModule,
    UsersModule,
    SingersModule,
    AdminModule,
    SongsModule,
    PlaylistsModule,
    FavoritesModule,
    SessionsModule,
    StreamingModule,
    StatsModule,
    UploadModule,
    AlbumsModule,
  ],
})
export class AppModule {}
