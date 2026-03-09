import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SingersService } from '../singers/singers.service';
import { SongsService } from '../songs/songs.service';
import { SessionsService } from '../sessions/sessions.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Song, SongDocument } from '../songs/schemas/song.schema';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private singersService: SingersService,
    private songsService: SongsService,
    private sessionsService: SessionsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
  ) {}

  async getUsers(skip = 0, limit = 20) {
    return this.usersService.findAll(skip, limit);
  }

  async banUser(userId: string) {
    return this.usersService.banUser(userId);
  }

  async unbanUser(userId: string) {
    return this.usersService.unbanUser(userId);
  }

  async getPendingSingers() {
    return this.singersService.getPendingApproval();
  }

  async approveSinger(singerId: string) {
    return this.singersService.approve(singerId);
  }

  async rejectSinger(singerId: string) {
    return this.singersService.reject(singerId);
  }

  async getPendingSongs() {
    return this.songsService.getPendingApproval();
  }

  async approveSong(songId: string) {
    return this.songsService.approve(songId);
  }

  async deleteSong(songId: string) {
    return this.songsService.delete(songId, '', UserRole.ADMIN);
  }

  async getActiveSessions() {
    return this.sessionsService.getAllActiveSessions();
  }

  async getPlatformStats() {
    const [userCount, songCount, totalPlays] = await Promise.all([
      this.userModel.countDocuments(),
      this.songModel.countDocuments({ isApproved: true }),
      this.songModel.aggregate([{ $group: { _id: null, total: { $sum: '$playCount' } } }]),
    ]);
    return {
      totalUsers: userCount,
      totalSongs: songCount,
      totalPlays: totalPlays[0]?.total || 0,
    };
  }
}
