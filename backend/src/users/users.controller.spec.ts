import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUser = {
    _id: 'user-1',
    name: 'Test',
    email: 'test@example.com',
    toObject: () => ({ _id: 'user-1', name: 'Test', email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const mockService = {
      findById: jest.fn().mockResolvedValue(mockUser),
      updateProfile: jest.fn(),
      followSinger: jest.fn(),
      unfollowSinger: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService) as jest.Mocked<UsersService>;
  });

  it('should be defined', () => expect(controller).toBeDefined());

  it('getProfile returns user without password', async () => {
    const result = await controller.getProfile('user-1');
    expect(service.findById).toHaveBeenCalledWith('user-1');
    expect(result).toHaveProperty('name', 'Test');
    expect(result).not.toHaveProperty('password');
  });

  it('updateProfile calls service', async () => {
    (service.updateProfile as jest.Mock).mockResolvedValue(mockUser);
    await controller.updateProfile('user-1', { name: 'Updated' });
    expect(service.updateProfile).toHaveBeenCalledWith('user-1', { name: 'Updated' });
  });

  it('followSinger calls service', async () => {
    (service.followSinger as jest.Mock).mockResolvedValue({});
    await controller.followSinger('user-1', 'singer-1');
    expect(service.followSinger).toHaveBeenCalledWith('user-1', 'singer-1');
  });
});
