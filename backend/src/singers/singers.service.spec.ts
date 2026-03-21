import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SingersService } from './singers.service';
import { SingerProfile } from './schemas/singer-profile.schema';
import { Song } from '../songs/schemas/song.schema';
import { SongsService } from '../songs/songs.service';

describe('SingersService', () => {
  let service: SingersService;
  let singerModel: any;
  let songsService: jest.Mocked<SongsService>;

  const mockProfile = { _id: 'profile-1', stageName: 'Artist', isApproved: true };

  beforeEach(async () => {
    singerModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      find: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }) }) }),
    };
    songsService = {
      create: jest.fn(),
      findBySinger: jest.fn(),
      countBySinger: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SongsService>;
    const songModel = { find: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SingersService,
        { provide: getModelToken(SingerProfile.name), useValue: singerModel },
        { provide: getModelToken(Song.name), useValue: songModel },
        { provide: SongsService, useValue: songsService },
      ],
    }).compile();

    service = module.get<SingersService>(SingersService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('apply', () => {
    it('throws ConflictException when already applied', async () => {
      singerModel.findOne.mockResolvedValue({});
      await expect(service.apply('user-1', { stageName: 'Artist' })).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfileByUserId', () => {
    it('throws NotFoundException when profile not found', async () => {
      singerModel.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
      await expect(service.getProfileByUserId('user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
