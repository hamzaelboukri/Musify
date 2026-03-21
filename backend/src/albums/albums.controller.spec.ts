import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

describe('AlbumsController', () => {
  let controller: AlbumsController;
  let service: jest.Mocked<AlbumsService>;

  const mockService = {
    create: jest.fn(),
    getMyAlbums: jest.fn(),
    addSongToAlbum: jest.fn(),
    removeSongFromAlbum: jest.fn(),
    deleteAlbum: jest.fn(),
    getById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [{ provide: AlbumsService, useValue: mockService }],
    }).compile();

    controller = module.get<AlbumsController>(AlbumsController);
    service = module.get(AlbumsService) as jest.Mocked<AlbumsService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('create calls service', async () => {
    mockService.create.mockResolvedValue({ _id: '1', name: 'Album' } as never);
    await controller.create('user-1', { name: 'Album' });
    expect(service.create).toHaveBeenCalledWith('user-1', { name: 'Album' });
  });

  it('getById calls service', async () => {
    mockService.getById.mockResolvedValue({ _id: '1', name: 'Album' } as never);
    await controller.getById('album-1');
    expect(service.getById).toHaveBeenCalledWith('album-1');
  });
});
