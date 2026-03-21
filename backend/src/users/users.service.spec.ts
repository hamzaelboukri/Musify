import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  const mockUser = {
    _id: { toString: () => 'user-1' },
    email: 'test@example.com',
    name: 'Test',
    following: [],
    save: jest.fn(),
  };

  beforeEach(async () => {
    userModel = {
      findById: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }) }) }) }),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('throws NotFoundException when user not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.findById('bad-id')).rejects.toThrow(NotFoundException);
    });

    it('returns user when found', async () => {
      userModel.findById.mockResolvedValue(mockUser);

      const result = await service.findById('user-1');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('calls findOne with email', async () => {
      userModel.findOne.mockResolvedValue(mockUser);

      await service.findByEmail('test@example.com');
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('updateProfile', () => {
    it('throws ConflictException when email already in use by another user', async () => {
      userModel.findOne.mockResolvedValue({ _id: { toString: () => 'other-user' } });

      await expect(
        service.updateProfile('user-1', { email: 'taken@example.com', name: 'Test' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('banUser', () => {
    it('throws BadRequestException when banning yourself', async () => {
      await expect(service.banUser('user-1', 'user-1')).rejects.toThrow(BadRequestException);
      expect(userModel.findById).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when user not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.banUser('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});
