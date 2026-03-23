import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from './schemas/album.schema';
import { Song } from '../songs/schemas/song.schema';
import { SingerProfile } from '../singers/schemas/singer-profile.schema';

describe('AlbumsService', () => {
  let service: AlbumsService;
  let albumModel: any;
  let singerModel: any;

  const mockProfile = { _id: 'profile-1', stageName: 'Artist', isApproved: true };

  beforeEach(async () => {
    albumModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }) }),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      updateMany: jest.fn(),
    };
    singerModel = {
      findOne: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockProfile) }),
    };
    const songModel = {
      findById: jest.fn().mockResolvedValue({ singerId: { toString: () => 'profile-1' } }),
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        { provide: getModelToken(Album.name), useValue: albumModel },
        { provide: getModelToken(Song.name), useValue: songModel },
        { provide: getModelToken(SingerProfile.name), useValue: singerModel },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('getById', () => {
    it('throws NotFoundException when album not found', async () => {
      albumModel.findById.mockReturnValue({ populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) }) });
      await expect(service.getById('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
