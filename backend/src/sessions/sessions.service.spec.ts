import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SessionsService } from './sessions.service';
import { Session } from './schemas/session.schema';

describe('SessionsService', () => {
  let service: SessionsService;
  let sessionModel: any;

  const saveMock = jest.fn().mockResolvedValue({});
  const findChain = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    sessionModel = jest.fn().mockImplementation(() => ({ save: saveMock }));
    (sessionModel as any).find = jest.fn().mockReturnValue(findChain);
    (sessionModel as any).findOne = jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    (sessionModel as any).updateMany = jest.fn().mockResolvedValue({});
    (sessionModel as any).findOneAndUpdate = jest.fn().mockResolvedValue({});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: getModelToken(Session.name), useValue: sessionModel },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('isDeviceAllowed returns allowed true when no active session', async () => {
    const result = await service.isDeviceAllowed('user-1', 'device-1');
    expect(result).toEqual({ allowed: true });
  });

  it('getAllActiveSessions returns empty array', async () => {
    const result = await service.getAllActiveSessions();
    expect(result).toEqual([]);
  });
});
