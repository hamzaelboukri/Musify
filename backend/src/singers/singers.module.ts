import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SingersService } from './singers.service';
import { SingersController } from './singers.controller';
import { SingerProfile, SingerProfileSchema } from './schemas/singer-profile.schema';
import { Song, SongSchema } from '../songs/schemas/song.schema';
import { SongsModule } from '../songs/songs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SingerProfile.name, schema: SingerProfileSchema },
      { name: Song.name, schema: SongSchema },
    ]),
    SongsModule,
  ],
  controllers: [SingersController],
  providers: [SingersService],
  exports: [SingersService],
})
export class SingersModule {}
