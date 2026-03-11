import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';

@Injectable()
export class PlaylistsService {
  constructor(@InjectModel(Playlist.name) private playlistModel: Model<PlaylistDocument>) {}

  async create(userId: string, name: string) {
    const playlist = new this.playlistModel({ userId, name });
    return playlist.save();
  }

  async findByUser(userId: string) {
    return this.playlistModel
      .find({ userId })
      .populate('songs')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findById(id: string) {
    const playlist = await this.playlistModel.findById(id).populate('songs').lean();
    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async update(id: string, userId: string, name: string) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    const uid = String(userId ?? '');
    if (playlist.userId.toString() !== uid) throw new ForbiddenException('Not your playlist');
    return this.playlistModel.findByIdAndUpdate(id, { name }, { new: true });
  }

  async delete(id: string, userId: string) {
    const playlist = await this.playlistModel.findById(id);
    if (!playlist) throw new NotFoundException('Playlist not found');
    const uid = String(userId ?? '');
    if (playlist.userId.toString() !== uid) throw new ForbiddenException('Not your playlist');
    await this.playlistModel.findByIdAndDelete(id);
    return { message: 'Playlist deleted' };
  }

  async addSong(playlistId: string, userId: string, songId: string) {
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new NotFoundException('Playlist not found');
    const uid = String(userId ?? '');
    if (playlist.userId.toString() !== uid) throw new ForbiddenException('Not your playlist');
    return this.playlistModel.findByIdAndUpdate(
      playlistId,
      { $addToSet: { songs: new Types.ObjectId(songId) } },
      { new: true },
    );
  }

  async removeSong(playlistId: string, userId: string, songId: string) {
    const playlist = await this.playlistModel.findById(playlistId);
    if (!playlist) throw new NotFoundException('Playlist not found');
    const uid = String(userId ?? '');
    if (playlist.userId.toString() !== uid) throw new ForbiddenException('Not your playlist');
    return this.playlistModel.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: new Types.ObjectId(songId) } },
      { new: true },
    );
  }
}
