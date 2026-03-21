import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Album, AlbumDocument } from './schemas/album.schema';
import { Song, SongDocument } from '../songs/schemas/song.schema';
import { SingerProfile, SingerProfileDocument } from '../singers/schemas/singer-profile.schema';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
    @InjectModel(SingerProfile.name) private singerModel: Model<SingerProfileDocument>,
  ) {}

  async create(userId: string, data: { name: string; coverImage?: string }) {
    const profile = await this.singerModel.findOne({ userId }).lean();
    if (!profile) throw new NotFoundException('Singer profile not found');
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');

    const album = await this.albumModel.create({
      name: data.name,
      artist: profile.stageName,
      singerId: profile._id,
      coverImage: data.coverImage || '',
      songs: [],
    });
    return album.save();
  }

  async getMyAlbums(userId: string) {
    const profile = await this.singerModel.findOne({ userId }).lean();
    if (!profile) throw new NotFoundException('Singer profile not found');
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');

    return this.albumModel
      .find({ singerId: profile._id })
      .populate('songs')
      .sort({ createdAt: -1 })
      .lean();
  }

  async addSongToAlbum(albumId: string, songId: string, userId: string) {
    const profile = await this.singerModel.findOne({ userId }).lean();
    if (!profile) throw new NotFoundException('Singer profile not found');
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');

    const album = await this.albumModel.findById(albumId);
    if (!album) throw new NotFoundException('Album not found');
    if (album.singerId.toString() !== profile._id.toString()) {
      throw new ForbiddenException('Not your album');
    }

    const song = await this.songModel.findById(songId);
    if (!song) throw new NotFoundException('Song not found');
    if (song.singerId.toString() !== profile._id.toString()) {
      throw new ForbiddenException('Not your song');
    }

    const songObjId = new Types.ObjectId(songId);
    if (album.songs.some((s) => s.toString() === songId)) {
      return album; // already in album
    }

    album.songs.push(songObjId);
    await album.save();

    await this.songModel.findByIdAndUpdate(songId, {
      album: album.name,
      albumId: album._id,
    });

    return this.albumModel.findById(albumId).populate('songs').lean();
  }

  async removeSongFromAlbum(albumId: string, songId: string, userId: string) {
    const profile = await this.singerModel.findOne({ userId }).lean();
    if (!profile) throw new NotFoundException('Singer profile not found');
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');

    const album = await this.albumModel.findById(albumId);
    if (!album) throw new NotFoundException('Album not found');
    if (album.singerId.toString() !== profile._id.toString()) {
      throw new ForbiddenException('Not your album');
    }

    album.songs = album.songs.filter((s) => s.toString() !== songId);
    await album.save();

    const song = await this.songModel.findById(songId);
    if (song && song.albumId?.toString() === albumId) {
      await this.songModel.findByIdAndUpdate(songId, {
        album: '',
        albumId: null,
      });
    }

    return this.albumModel.findById(albumId).populate('songs').lean();
  }

  async deleteAlbum(albumId: string, userId: string) {
    const profile = await this.singerModel.findOne({ userId }).lean();
    if (!profile) throw new NotFoundException('Singer profile not found');
    if (!profile.isApproved) throw new ForbiddenException('Singer profile not approved');

    const album = await this.albumModel.findById(albumId);
    if (!album) throw new NotFoundException('Album not found');
    if (album.singerId.toString() !== profile._id.toString()) {
      throw new ForbiddenException('Not your album');
    }

    await this.songModel.updateMany(
      { albumId: album._id },
      { album: '', albumId: null },
    );
    await this.albumModel.findByIdAndDelete(albumId);
    return { message: 'Album deleted' };
  }

  async getById(id: string) {
    const album = await this.albumModel.findById(id).populate('songs').lean();
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }
}
