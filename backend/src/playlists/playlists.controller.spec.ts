import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';

describe('PlaylistsController', () => {
  let controller: PlaylistsController;
  let service: jest.Mocked<PlaylistsService>;

  const mockService = {
    create: jest.fn(),
    findByUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addSong: jest.fn(),
    removeSong: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistsController],
      providers: [{ provide: PlaylistsService, useValue: mockService }],
    }).compile();

    controller = module.get<PlaylistsController>(PlaylistsController);
    service = module.get(PlaylistsService) as jest.Mocked<PlaylistsService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('create calls service with userId and name', async () => {
    mockService.create.mockResolvedValue({ _id: '1', name: 'My List' } as never);
    await controller.create('user-1', 'My List');
    expect(service.create).toHaveBeenCalledWith('user-1', 'My List');
  });

  it('findByUser calls service', async () => {
    mockService.findByUser.mockResolvedValue([]);
    await controller.findByUser('user-1');
    expect(service.findByUser).toHaveBeenCalledWith('user-1');
  });

  it('findById calls service', async () => {
    mockService.findById.mockResolvedValue({ _id: '1', name: 'List' } as never);
    await controller.findById('playlist-1');
    expect(service.findById).toHaveBeenCalledWith('playlist-1');
  });

  it('addSong calls service with correct params', async () => {
    mockService.addSong.mockResolvedValue({} as never);
    await controller.addSong('playlist-1', 'song-1', 'user-1');
    expect(service.addSong).toHaveBeenCalledWith('playlist-1', 'user-1', 'song-1');
  });
});
