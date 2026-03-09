import { Module } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { SongsModule } from '../songs/songs.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [SessionsModule, SongsModule, StatsModule],
  controllers: [StreamingController],
  providers: [StreamingService],
  exports: [StreamingService],
})
export class StreamingModule {}
