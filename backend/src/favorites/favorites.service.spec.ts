import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FavoritesService } from './favorites.service';
import { User } from '../users/schemas/user.schema';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let userModel: any;

  const mockUser = {
    _id: 'user-1',
    favorites: [],
  };

  beforeEach(async () => {
    userModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFavorites', () => {
    it('returns empty array when user has no favorites', async () => {
      userModel.findById.mockReturnValue({ populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue({ favorites: [] }) }) });

      const result = await service.getFavorites('user-1');
      expect(result).toEqual([]);
    });

    it('returns favorites when user has some', async () => {
      const favs = [{ _id: 's1', title: 'Song1' }];
      userModel.findById.mockReturnValue({ populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue({ favorites: favs }) }) });

      const result = await service.getFavorites('user-1');
      expect(result).toEqual(favs);
    });
  });

  describe('addFavorite', () => {
    it('calls findByIdAndUpdate with $addToSet', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      await service.addFavorite('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        expect.objectContaining({ $addToSet: expect.any(Object) }),
        { new: true },
      );
    });
  });

  describe('removeFavorite', () => {
    it('calls findByIdAndUpdate with $pull', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue(mockUser);

      await service.removeFavorite('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');

      expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        expect.objectContaining({ $pull: expect.any(Object) }),
        { new: true },
      );
    });
  });

  describe('isFavorite', () => {
    it('returns false when user has no favorites', async () => {
      userModel.findById.mockResolvedValue({ favorites: [] });

      const result = await service.isFavorite('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');
      expect(result).toBe(false);
    });
  });
});
