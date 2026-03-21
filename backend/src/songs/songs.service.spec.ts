import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './schemas/song.schema';
import { User } from '../users/schemas/user.schema';

describe('SongsService', () => {
  let service: SongsService;
  let songModel: {
    find: jest.Mock;
    findById: jest.Mock;
    countDocuments: jest.Mock;
    aggregate: jest.Mock;
  };
  let userModel: { aggregate: jest.Mock };

  const mockSong = {
    _id: { toString: () => '507f1f77bcf86cd799439011' },
    title: 'Test Song',
    artist: 'Test Artist',
    audioUrl: 'http://localhost:3001/uploads/audio/f.mp3',
    isApproved: true,
    playCount: 0,
    duration: 180,
  };

  beforeEach(async () => {
    songModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      }),
      findById: jest.fn(),
      countDocuments: jest.fn().mockResolvedValue(42),
      aggregate: jest.fn().mockResolvedValue([]),
    };
    userModel = {
      aggregate: jest.fn().mockResolvedValue([{ total: 0 }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        { provide: getModelToken(Song.name), useValue: songModel },
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('returns count from model', async () => {
      const n = await service.count({});
      expect(n).toBe(42);
      expect(songModel.countDocuments).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('throws NotFoundException when missing', async () => {
      songModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(service.findById('badid')).rejects.toThrow(NotFoundException);
    });

    it('returns song when found', async () => {
      songModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockSong),
        }),
      });

      const result = await service.findById('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockSong);
    });
  });

  describe('download', () => {
    it('throws ForbiddenException when song not approved', async () => {
      songModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue({ ...mockSong, isApproved: false }),
      });

      const res = { setHeader: jest.fn(), sendFile: jest.fn(), send: jest.fn(), headersSent: false } as never;
      await expect(service.download('507f1f77bcf86cd799439011', res)).rejects.toThrow(ForbiddenException);
    });
  });
});
