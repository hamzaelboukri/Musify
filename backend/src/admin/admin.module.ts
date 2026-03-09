import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { SingersModule } from '../singers/singers.module';
import { SongsModule } from '../songs/songs.module';
import { SessionsModule } from '../sessions/sessions.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Song, SongSchema } from '../songs/schemas/song.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Song.name, schema: SongSchema },
    ]),
    UsersModule,
    SingersModule,
    SongsModule,
    SessionsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
