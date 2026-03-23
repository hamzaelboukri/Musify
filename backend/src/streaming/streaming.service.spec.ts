import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { SessionsService } from '../sessions/sessions.service';
import { SongsService } from '../songs/songs.service';
import { StatsService } from '../stats/stats.service';
import { StreamingGateway } from './streaming.gateway';

describe('StreamingService', () => {
  let service: StreamingService;
  let sessionsService: jest.Mocked<SessionsService>;

  const mockSessionsService = {
    isDeviceAllowed: jest.fn(),
    deactivateOtherSessions: jest.fn(),
    create: jest.fn(),
    stopSession: jest.fn(),
    updateActivity: jest.fn(),
  };
  const mockSongsService = { incrementPlayCount: jest.fn() };
  const mockStatsService = { recordListen: jest.fn() };
  const mockGateway = { notifyDeviceTakenOver: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockSessionsService.isDeviceAllowed.mockResolvedValue({ allowed: true });
    mockSessionsService.create.mockResolvedValue({});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamingService,
        { provide: SessionsService, useValue: mockSessionsService },
        { provide: SongsService, useValue: mockSongsService },
        { provide: StatsService, useValue: mockStatsService },
        { provide: StreamingGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<StreamingService>(StreamingService);
    sessionsService = module.get(SessionsService) as jest.Mocked<SessionsService>;
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('startStreaming creates session when allowed', async () => {
    await service.startStreaming('user-1', 'device-1', 'token');
    expect(sessionsService.create).toHaveBeenCalledWith('user-1', 'device-1', 'token');
  });

  it('startStreaming throws ConflictException when block_new and not allowed', async () => {
    sessionsService.isDeviceAllowed.mockResolvedValueOnce({ allowed: false, message: 'Another device' });
    await expect(
      service.startStreaming('user-1', 'device-1', 'token', 'block_new'),
    ).rejects.toThrow(ConflictException);
  });

  it('stopStreaming calls sessionsService', async () => {
    mockSessionsService.stopSession.mockResolvedValue({});
    await service.stopStreaming('user-1');
    expect(sessionsService.stopSession).toHaveBeenCalledWith('user-1', undefined);
  });
});
