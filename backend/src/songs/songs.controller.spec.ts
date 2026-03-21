import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

describe('SongsController', () => {
  let controller: SongsController;
  let songsService: jest.Mocked<SongsService>;

  const mockSongsService = {
    findAll: jest.fn(),
    getTrending: jest.fn(),
    getNewReleases: jest.fn(),
    getPlatformStats: jest.fn(),
    count: jest.fn(),
    findById: jest.fn(),
    findBySinger: jest.fn(),
    download: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        { provide: SongsService, useValue: mockSongsService },
      ],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    songsService = module.get(SongsService) as jest.Mocked<SongsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('calls service with filters and pagination', async () => {
      mockSongsService.findAll.mockResolvedValue([]);

      await controller.findAll('Pop', 'Artist1', 'Album1', 'search', '0', '10');

      expect(songsService.findAll).toHaveBeenCalledWith(
        { genre: 'Pop', artist: 'Artist1', album: 'Album1', search: 'search' },
        0,
        10,
      );
    });

    it('uses default skip=0 and limit=20 when not provided', async () => {
      mockSongsService.findAll.mockResolvedValue([]);

      await controller.findAll();

      expect(songsService.findAll).toHaveBeenCalledWith({}, 0, 20);
    });
  });

  describe('getTrending', () => {
    it('calls service with limit', async () => {
      mockSongsService.getTrending.mockResolvedValue([]);

      await controller.getTrending('5');

      expect(songsService.getTrending).toHaveBeenCalledWith(5);
    });
  });

  describe('getCount', () => {
    it('calls service with filters', async () => {
      mockSongsService.count.mockResolvedValue(42);

      const result = await controller.getCount('Rock');

      expect(songsService.count).toHaveBeenCalledWith({ genre: 'Rock', artist: undefined, album: undefined, search: undefined });
      expect(result).toBe(42);
    });
  });

  describe('findById', () => {
    it('calls service with id', async () => {
      const song = { _id: '1', title: 'Song1' };
      mockSongsService.findById.mockResolvedValue(song as never);

      const result = await controller.findById('song-id');

      expect(songsService.findById).toHaveBeenCalledWith('song-id');
      expect(result).toEqual(song);
    });
  });

  describe('findBySinger', () => {
    it('calls service with singerId', async () => {
      mockSongsService.findBySinger.mockResolvedValue([]);

      await controller.findBySinger('singer-id');

      expect(songsService.findBySinger).toHaveBeenCalledWith('singer-id');
    });
  });
});
