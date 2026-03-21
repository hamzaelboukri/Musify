import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './schemas/playlist.schema';

describe('PlaylistsService', () => {
  let service: PlaylistsService;
  let playlistModel: any;

  const mockPlaylist = {
    _id: 'playlist-1',
    userId: { toString: () => 'user-1' },
    name: 'My Playlist',
    songs: [],
  };

  beforeEach(async () => {
    playlistModel = {
      find: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }) }),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        { provide: getModelToken(Playlist.name), useValue: playlistModel },
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('throws NotFoundException when playlist not found', async () => {
      playlistModel.findById.mockReturnValue({ populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }) });

      await expect(service.findById('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('returns playlist when found', async () => {
      playlistModel.findById.mockReturnValue({ populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockPlaylist) }) });

      const result = await service.findById('playlist-1');
      expect(result).toEqual(mockPlaylist);
    });
  });

  describe('update', () => {
    it('throws ForbiddenException when user does not own playlist', async () => {
      playlistModel.findById.mockResolvedValue({ ...mockPlaylist, userId: { toString: () => 'user-1' } });

      await expect(service.update('playlist-1', 'different-user', 'New Name')).rejects.toThrow(ForbiddenException);
      expect(playlistModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('throws NotFoundException when playlist not found', async () => {
      playlistModel.findById.mockResolvedValue(null);

      await expect(service.delete('bad-id', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('addSong', () => {
    it('throws ForbiddenException when not playlist owner', async () => {
      playlistModel.findById.mockResolvedValue({ userId: { toString: () => 'owner-id' } });

      await expect(service.addSong('playlist-1', 'other-user', 'song-1')).rejects.toThrow(ForbiddenException);
    });
  });
});
