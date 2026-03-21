import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { StatsService } from './stats.service';
import { ListeningHistory } from './schemas/listening-history.schema';

describe('StatsService', () => {
  let service: StatsService;
  let historyModel: any;

  const saveMock = jest.fn().mockResolvedValue({});
  const findChain = {
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    historyModel = jest.fn().mockImplementation(() => ({ save: saveMock }));
    (historyModel as any).find = jest.fn().mockReturnValue(findChain);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        { provide: getModelToken(ListeningHistory.name), useValue: historyModel },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  describe('getListeningHistory', () => {
    it('returns empty array when no history', async () => {
      const result = await service.getListeningHistory('user-1');
      expect(result).toEqual([]);
    });
  });
});
