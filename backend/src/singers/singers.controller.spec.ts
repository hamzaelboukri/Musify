import { Test, TestingModule } from '@nestjs/testing';
import { SingersController } from './singers.controller';
import { SingersService } from './singers.service';

describe('SingersController', () => {
  let controller: SingersController;
  let service: jest.Mocked<SingersService>;

  const mockService = {
    apply: jest.fn(),
    getProfileByUserId: jest.fn(),
    updateProfile: jest.fn(),
    getAllApproved: jest.fn(),
    uploadSong: jest.fn(),
    getMySongsCount: jest.fn(),
    getMySongs: jest.fn(),
    updateSong: jest.fn(),
    deleteSong: jest.fn(),
    getProfileById: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SingersController],
      providers: [{ provide: SingersService, useValue: mockService }],
    }).compile();

    controller = module.get<SingersController>(SingersController);
    service = module.get(SingersService) as jest.Mocked<SingersService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('apply calls service with userId and body', async () => {
    mockService.apply.mockResolvedValue({ _id: '1', stageName: 'Artist' } as never);
    await controller.apply('user-1', { stageName: 'Artist', bio: 'Bio' });
    expect(service.apply).toHaveBeenCalledWith('user-1', { stageName: 'Artist', bio: 'Bio' });
  });

  it('getAllApproved calls service', async () => {
    mockService.getAllApproved.mockResolvedValue([]);
    await controller.getAllApproved();
    expect(service.getAllApproved).toHaveBeenCalled();
  });

  it('getById calls service', async () => {
    mockService.getProfileById.mockResolvedValue({ _id: '1', stageName: 'Artist' } as never);
    await controller.getById('singer-1');
    expect(service.getProfileById).toHaveBeenCalledWith('singer-1');
  });

  it('getMySongs calls service with skip and limit', async () => {
    mockService.getMySongs.mockResolvedValue([]);
    await controller.getMySongs('user-1', '10', '5');
    expect(service.getMySongs).toHaveBeenCalledWith('user-1', 10, 5);
  });
});
