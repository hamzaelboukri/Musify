import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { Album, AlbumSchema } from './schemas/album.schema';
import { Song, SongSchema } from '../songs/schemas/song.schema';
import { SingerProfile, SingerProfileSchema } from '../singers/schemas/singer-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Album.name, schema: AlbumSchema },
      { name: Song.name, schema: SongSchema },
      { name: SingerProfile.name, schema: SingerProfileSchema },
    ]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
