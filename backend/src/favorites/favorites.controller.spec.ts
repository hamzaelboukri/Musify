import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: jest.Mocked<FavoritesService>;

  const mockService = {
    getFavorites: jest.fn(),
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    isFavorite: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [{ provide: FavoritesService, useValue: mockService }],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get(FavoritesService) as jest.Mocked<FavoritesService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('getFavorites calls service', async () => {
    mockService.getFavorites.mockResolvedValue([]);
    await controller.getFavorites('user-1');
    expect(service.getFavorites).toHaveBeenCalledWith('user-1');
  });

  it('addFavorite calls service', async () => {
    mockService.addFavorite.mockResolvedValue({} as never);
    await controller.addFavorite('user-1', '507f1f77bcf86cd799439011');
    expect(service.addFavorite).toHaveBeenCalledWith('user-1', '507f1f77bcf86cd799439011');
  });

  it('checkFavorite calls isFavorite', async () => {
    mockService.isFavorite.mockResolvedValue(true);
    const result = await controller.checkFavorite('user-1', '507f1f77bcf86cd799439011');
    expect(service.isFavorite).toHaveBeenCalledWith('user-1', '507f1f77bcf86cd799439011');
    expect(result).toBe(true);
  });
});
