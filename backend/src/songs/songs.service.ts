import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song, SongDocument } from './schemas/song.schema';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class SongsService {
  constructor(@InjectModel(Song.name) private songModel: Model<SongDocument>) {}

  async create(data: Partial<Song>) {
    const song = new this.songModel(data);
    return song.save();
  }

  async findAll(filters?: { genre?: string; artist?: string; search?: string }, skip = 0, limit = 20) {
    const query: any = { isApproved: true };
    if (filters?.genre) query.genre = new RegExp(filters.genre, 'i');
    if (filters?.artist) query.artist = new RegExp(filters.artist, 'i');
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

  async findBySinger(singerId: string, includeUnapproved = false) {
    const query: any = { singerId };
    if (!includeUnapproved) query.isApproved = true;
    return this.songModel.find(query).sort({ createdAt: -1 }).lean();
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

  async getPendingApproval() {
    return this.songModel.find({ isApproved: false }).populate('singerId').lean();
  }

  async approve(id: string) {
    return this.songModel.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  }
}
