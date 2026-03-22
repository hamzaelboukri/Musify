import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: jest.Mocked<SessionsService>;

  const mockService = {
    getSessionsByUser: jest.fn(),
    getAllActiveSessions: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [{ provide: SessionsService, useValue: mockService }],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
    service = module.get(SessionsService) as jest.Mocked<SessionsService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('getMySessions calls service', async () => {
    mockService.getSessionsByUser.mockResolvedValue([]);
    await controller.getMySessions('user-1');
    expect(service.getSessionsByUser).toHaveBeenCalledWith('user-1');
  });

  it('getAllActiveSessions calls service', async () => {
    mockService.getAllActiveSessions.mockResolvedValue([]);
    await controller.getAllActiveSessions();
    expect(service.getAllActiveSessions).toHaveBeenCalled();
  });
});
