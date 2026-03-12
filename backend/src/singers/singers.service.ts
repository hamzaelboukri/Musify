import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SingerProfile, SingerProfileDocument } from './schemas/singer-profile.schema';
import { Song, SongDocument } from '../songs/schemas/song.schema';
import { UserRole } from '../users/schemas/user.schema';
import { SongsService } from '../songs/songs.service';
import { CreateSongDto } from '../songs/dto/create-song.dto';

type UploadSongData = Omit<CreateSongDto, 'singerId'>;

@Injectable()
export class SingersService {
  constructor(
    @InjectModel(SingerProfile.name) private singerModel: Model<SingerProfileDocument>,
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
    private songsService: SongsService,
  ) {}

  async apply(userId: string, data: { stageName: string; bio?: string }) {
    const existing = await this.singerModel.findOne({ userId });
    if (existing) throw new ConflictException('Already applied as singer');
    const profile = new this.singerModel({ userId, ...data, isApproved: false });
    return profile.save();
  }

  async getProfileByUserId(userId: string) {
    const profile = await this.singerModel.findOne({ userId }).lean();
    if (!profile) throw new NotFoundException('Singer profile not found');
    return profile;
  }

  async getProfileById(id: string) {
    const profile = await this.singerModel.findById(id).populate('userId').lean();
    if (!profile) throw new NotFoundException('Singer not found');
    return profile;
  }

  async getAllApproved(skip = 0, limit = 20) {
    return this.singerModel
      .find({ isApproved: true })
      .populate('userId', 'name')
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async getPendingApproval() {
    return this.singerModel.find({ isApproved: false }).populate('userId', 'name email').lean();
  }

  async approve(id: string) {
    return this.singerModel.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  }

  async reject(id: string) {
    await this.singerModel.findByIdAndDelete(id);
    return { message: 'Singer application rejected' };
  }

  async uploadSong(userId: string, data: Partial<UploadSongData>) {
    const profile = await this.getProfileByUserId(userId);
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');
    return this.songsService.create({
      ...data,
      singerId: profile._id,
      isApproved: true,
    });
  }

  async getMySongs(userId: string) {
    const profile = await this.getProfileByUserId(userId);
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');
    return this.songsService.findBySinger(profile._id.toString(), true);
  }

  async updateSong(songId: string, userId: string, data: Partial<UploadSongData>) {
    const profile = await this.getProfileByUserId(userId);
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');
    return this.songsService.update(songId, data, profile._id.toString(), UserRole.SINGER);
  }

  async deleteSong(songId: string, userId: string) {
    const profile = await this.getProfileByUserId(userId);
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');
    return this.songsService.delete(songId, profile._id.toString(), UserRole.SINGER);
  }

  async getStatistics(userId: string) {
    const profile = await this.getProfileByUserId(userId);
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');
    const songs = await this.songModel.find({ singerId: profile._id }).lean();
    const totalPlays = songs.reduce((sum, s) => sum + (s.playCount || 0), 0);
    const approvedCount = songs.filter((s) => s.isApproved).length;
    const pendingCount = songs.filter((s) => !s.isApproved).length;
    return {
      totalSongs: songs.length,
      totalPlays,
      approvedSongs: approvedCount,
      pendingSongs: pendingCount,
      topSongs: songs.sort((a, b) => (b.playCount || 0) - (a.playCount || 0)).slice(0, 5),
    };
  }
}
