import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { StreamingGateway } from './streaming.gateway';
import { SessionsModule } from '../sessions/sessions.module';
import { SongsModule } from '../songs/songs.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [
    SessionsModule,
    SongsModule,
    StatsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],
  controllers: [StreamingController],
  providers: [StreamingService, StreamingGateway],
  exports: [StreamingService],
})
export class StreamingModule {}
