import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/schemas/user.schema';
import { SingerProfile } from '../singers/schemas/singer-profile.schema';
import { Song } from '../songs/schemas/song.schema';
import { Playlist } from '../playlists/schemas/playlist.schema';
import { UserRole } from '../users/schemas/user.schema';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const singerModel = app.get<Model<SingerProfile>>(getModelToken(SingerProfile.name));
  const songModel = app.get<Model<Song>>(getModelToken(Song.name));
  const playlistModel = app.get<Model<Playlist>>(getModelToken(Playlist.name));

  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);
  const singerPassword = await bcrypt.hash('Singer123!', 10);

  // Create Admin
  let admin = await userModel.findOne({ email: 'admin@musify.com' });
  if (!admin) {
    admin = await userModel.create({
      name: 'Admin User',
      email: 'admin@musify.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    console.log('Created admin: admin@musify.com / Admin123!');
  }

  // Create Singer
  let singerUser = await userModel.findOne({ email: 'singer@musify.com' });
  if (!singerUser) {
    singerUser = await userModel.create({
      name: 'John Singer',
      email: 'singer@musify.com',
      password: singerPassword,
      role: UserRole.SINGER,
    });
    console.log('Created singer: singer@musify.com / Singer123!');
  }

  let singerProfile = await singerModel.findOne({ userId: singerUser._id });
  if (!singerProfile) {
    singerProfile = await singerModel.create({
      userId: singerUser._id,
      stageName: 'John Star',
      bio: 'Award-winning artist',
      image: 'https://picsum.photos/200',
      isApproved: true,
    });
    console.log('Created singer profile: John Star');
  }

  // Create User
  let user = await userModel.findOne({ email: 'user@musify.com' });
  if (!user) {
    user = await userModel.create({
      name: 'Jane Listener',
      email: 'user@musify.com',
      password: userPassword,
      role: UserRole.USER,
    });
    console.log('Created user: user@musify.com / User123!');
  }

  // Create sample songs
  const songsCount = await songModel.countDocuments();
  if (songsCount === 0) {
    const genres = ['Pop', 'Rock', 'Jazz', 'Electronic', 'Hip-Hop'];
    const songs = [
      { title: 'Summer Vibes', artist: 'John Star', genre: 'Pop', duration: 210 },
      { title: 'Midnight Drive', artist: 'John Star', genre: 'Electronic', duration: 245 },
      { title: 'Acoustic Dreams', artist: 'John Star', genre: 'Jazz', duration: 195 },
      { title: 'City Lights', artist: 'John Star', genre: 'Pop', duration: 220 },
      { title: 'Neon Nights', artist: 'John Star', genre: 'Electronic', duration: 230 },
    ];
    for (const s of songs) {
      await songModel.create({
        ...s,
        singerId: singerProfile._id,
        album: 'First Album',
        coverImage: 'https://picsum.photos/300',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        playCount: Math.floor(Math.random() * 1000),
        isApproved: true,
      });
    }
    console.log('Created 5 sample songs');
  }

  // Create sample playlist
  const playlistsCount = await playlistModel.countDocuments();
  if (playlistsCount === 0 && user) {
    const songs = await songModel.find().limit(3);
    await playlistModel.create({
      name: 'My Favorites',
      userId: user._id,
      songs: songs.map((s) => s._id),
    });
    console.log('Created sample playlist');
  }

  await app.close();
  console.log('Seed completed!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
