import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

describe('StatsController', () => {
  let controller: StatsController;
  let service: jest.Mocked<StatsService>;

  const mockService = {
    getListeningHistory: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [{ provide: StatsService, useValue: mockService }],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    service = module.get(StatsService) as jest.Mocked<StatsService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('getListeningHistory calls service with userId and limit', async () => {
    mockService.getListeningHistory.mockResolvedValue([]);
    await controller.getListeningHistory('user-1', '25');
    expect(service.getListeningHistory).toHaveBeenCalledWith('user-1', 25);
  });

  it('getListeningHistory uses default limit 50 when not provided', async () => {
    mockService.getListeningHistory.mockResolvedValue([]);
    await controller.getListeningHistory('user-1');
    expect(service.getListeningHistory).toHaveBeenCalledWith('user-1', 50);
  });
});
