import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { join } from 'path';
import { existsSync } from 'fs';
import { Song, SongDocument } from './schemas/song.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<Song>) {
    const song = new this.songModel(data);
    return song.save();
  }

  async count(filters?: { genre?: string; artist?: string; album?: string; search?: string }) {
    const query: any = { isApproved: true };
    if (filters?.genre) query.genre = new RegExp(filters.genre, 'i');
    if (filters?.artist) query.artist = new RegExp(filters.artist, 'i');
    if (filters?.album) query.album = new RegExp(filters.album, 'i');
    if (filters?.search) {
      query.$or = [
        { title: new RegExp(filters.search, 'i') },
        { artist: new RegExp(filters.search, 'i') },
        { album: new RegExp(filters.search, 'i') },
      ];
    }
    return this.songModel.countDocuments(query);
  }

  async findAll(filters?: { genre?: string; artist?: string; album?: string; search?: string }, skip = 0, limit = 20) {
    const query: any = { isApproved: true };
    if (filters?.genre) query.genre = new RegExp(filters.genre, 'i');
    if (filters?.artist) query.artist = new RegExp(filters.artist, 'i');
    if (filters?.album) query.album = new RegExp(filters.album, 'i');
    if (filters?.search) {
      query.$or = [
        { title: new RegExp(filters.search, 'i') },
        { artist: new RegExp(filters.search, 'i') },
        { album: new RegExp(filters.search, 'i') },
      ];
    }
    return this.songModel
      .find(query)
      .populate('singerId')
      .skip(skip)
      .limit(limit)
      .sort({ playCount: -1, createdAt: -1 })
      .lean();
  }

  async findById(id: string) {
    const song = await this.songModel.findById(id).populate('singerId').lean();
    if (!song) throw new NotFoundException('Song not found');
    return song;
  }

  async findBySinger(singerId: string, includeUnapproved = false, skip = 0, limit = 50) {
    const query: any = { singerId: new Types.ObjectId(singerId) };
    if (!includeUnapproved) query.isApproved = true;
    return this.songModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async countBySinger(singerId: string, includeUnapproved = false) {
    const query: any = { singerId: new Types.ObjectId(singerId) };
    if (!includeUnapproved) query.isApproved = true;
    return this.songModel.countDocuments(query);
  }

  async update(id: string, data: Partial<Song>, singerProfileId: string, userRole: UserRole) {
    const song = await this.songModel.findById(id);
    if (!song) throw new NotFoundException('Song not found');
    if (userRole !== UserRole.ADMIN && song.singerId.toString() !== singerProfileId) {
      throw new ForbiddenException('Not authorized to update this song');
    }
    return this.songModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string, singerProfileId: string, userRole: UserRole) {
    const song = await this.songModel.findById(id);
    if (!song) throw new NotFoundException('Song not found');
    if (userRole !== UserRole.ADMIN && song.singerId.toString() !== singerProfileId) {
      throw new ForbiddenException('Not authorized to delete this song');
    }
    await this.songModel.findByIdAndDelete(id);
    return { message: 'Song deleted' };
  }

  async incrementPlayCount(id: string) {
    return this.songModel.findByIdAndUpdate(id, { $inc: { playCount: 1 } }, { new: true });
  }

  async getTrending(limit = 10) {
    return this.songModel
      .find({ isApproved: true })
      .populate('singerId')
      .sort({ playCount: -1 })
      .limit(limit)
      .lean();
  }

  async getNewReleases(limit = 10, genre?: string) {
    const query: any = { isApproved: true };
    if (genre) query.genre = new RegExp(genre, 'i');
    return this.songModel
      .find(query)
      .populate('singerId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getPlatformStats() {
    const [totalPlays, totalSongs, totalLikesResult] = await Promise.all([
      this.songModel.aggregate([{ $match: { isApproved: true } }, { $group: { _id: null, total: { $sum: '$playCount' } } }]),
      this.songModel.countDocuments({ isApproved: true }),
      this.userModel.aggregate([{ $project: { count: { $size: { $ifNull: ['$favorites', []] } } } }, { $group: { _id: null, total: { $sum: '$count' } } }]),
    ]);
    return {
      totalStreams: totalPlays[0]?.total ?? 0,
      totalSongs: totalSongs ?? 0,
      totalDownloads: 0,
      totalLikes: totalLikesResult[0]?.total ?? 0,
    };
  }

  async getPendingApproval() {
    return this.songModel.find({ isApproved: false }).populate('singerId').lean();
  }

  async approve(id: string) {
    return this.songModel.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  }

  async download(id: string, res: Response): Promise<void> {
    const song = await this.songModel.findById(id).lean();
    if (!song) throw new NotFoundException('Song not found');
    if (!song.isApproved) throw new ForbiddenException('Song is not available for download');

    const safeName = (s: string) => (s || 'Unknown').replace(/[<>:"/\\|?*]/g, '').trim() || 'track';
    const filename = `${safeName(song.artist)} - ${safeName(song.title)}.mp3`;

    const audioUrl = song.audioUrl;
    if (!audioUrl || !audioUrl.trim()) throw new NotFoundException('Audio file not found');

    const audioDir = join(process.cwd(), 'uploads', 'audio');
    const uploadsMatch = audioUrl.match(/\/uploads\/audio\/([^/?#]+)/);
    const localFilename = uploadsMatch?.[1]?.replace(/\.\./g, '')?.replace(/[\/\\]/g, '');

    if (localFilename && existsSync(join(audioDir, localFilename))) {
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
      res.sendFile(localFilename, { root: audioDir }, (err) => {
        if (err && !res.headersSent) res.status(500).json({ message: 'Error serving file' });
      });
      return;
    }

    try {
      const response = await fetch(audioUrl, { redirect: 'follow' });
      if (!response.ok) throw new NotFoundException('Audio file not available');
      const contentType = response.headers.get('content-type') || 'audio/mpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      res.send(buffer);
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof ForbiddenException) throw e;
      throw new NotFoundException('Audio file not available');
    }
  }
}
