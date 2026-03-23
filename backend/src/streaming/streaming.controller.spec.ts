import { Test, TestingModule } from '@nestjs/testing';
import { StreamingController } from './streaming.controller';
import { StreamingService } from './streaming.service';

describe('StreamingController', () => {
  let controller: StreamingController;
  let service: jest.Mocked<StreamingService>;

  const mockService = {
    startStreaming: jest.fn(),
    stopStreaming: jest.fn(),
    checkSession: jest.fn(),
    recordPlay: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamingController],
      providers: [{ provide: StreamingService, useValue: mockService }],
    }).compile();

    controller = module.get<StreamingController>(StreamingController);
    service = module.get(StreamingService) as jest.Mocked<StreamingService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('startStreaming calls service', async () => {
    mockService.startStreaming.mockResolvedValue({});
    await controller.startStreaming('user-1', {
      deviceId: 'dev-1',
      accessToken: 'tok',
      action: 'stop_previous',
    });
    expect(service.startStreaming).toHaveBeenCalledWith('user-1', 'dev-1', 'tok', 'stop_previous');
  });

  it('recordPlay calls service', async () => {
    mockService.recordPlay.mockResolvedValue({ success: true } as never);
    await controller.recordPlay('user-1', { songId: 'song-1', deviceId: 'dev-1' });
    expect(service.recordPlay).toHaveBeenCalledWith('user-1', 'song-1', 'dev-1');
  });
});
