import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: jest.Mocked<AdminService>;

  const mockService = {
    getPlatformStats: jest.fn(),
    getUsers: jest.fn(),
    banUser: jest.fn(),
    unbanUser: jest.fn(),
    getPendingSingers: jest.fn(),
    approveSinger: jest.fn(),
    rejectSinger: jest.fn(),
    getPendingSongs: jest.fn(),
    getAllSongs: jest.fn(),
    approveSong: jest.fn(),
    deleteSong: jest.fn(),
    getActiveSessions: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: mockService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('getPlatformStats calls service', async () => {
    mockService.getPlatformStats.mockResolvedValue({ totalUsers: 10 } as never);
    await controller.getPlatformStats();
    expect(service.getPlatformStats).toHaveBeenCalled();
  });

  it('getUsers calls service with skip and limit', async () => {
    mockService.getUsers.mockResolvedValue([]);
    await controller.getUsers('5', '15');
    expect(service.getUsers).toHaveBeenCalledWith(5, 15);
  });

  it('banUser calls service', async () => {
    mockService.banUser.mockResolvedValue({} as never);
    await controller.banUser('user-1', 'admin-1');
    expect(service.banUser).toHaveBeenCalledWith('user-1', 'admin-1');
  });

  it('approveSinger calls service', async () => {
    mockService.approveSinger.mockResolvedValue({} as never);
    await controller.approveSinger('singer-1');
    expect(service.approveSinger).toHaveBeenCalledWith('singer-1');
  });

  it('approveSong calls service', async () => {
    mockService.approveSong.mockResolvedValue({} as never);
    await controller.approveSong('song-1');
    expect(service.approveSong).toHaveBeenCalledWith('song-1');
  });
});
