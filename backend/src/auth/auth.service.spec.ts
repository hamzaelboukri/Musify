import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterRole } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'findByEmail' | 'create' | 'findById' | 'clearRefreshToken' | 'setRefreshToken'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign' | 'verify'>>;

  const mockUser = {
    _id: { toString: () => 'user-id-1' },
    email: 'test@example.com',
    password: 'hashed',
    name: 'Test',
    role: 'USER',
    isBanned: false,
    refreshToken: 'old-refresh',
    toObject: () => ({
      _id: 'user-id-1',
      email: 'test@example.com',
      name: 'Test',
      role: 'USER',
    }),
  };

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      clearRefreshToken: jest.fn(),
      setRefreshToken: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
      verify: jest.fn(),
    };

    process.env.JWT_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('throws ConflictException when email exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as never);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'secret123',
          name: 'Test',
          role: RegisterRole.USER,
        }),
      ).rejects.toThrow(ConflictException);

      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('creates user and returns tokens when email is new', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser as never);

      const result = await service.register({
        email: 'new@example.com',
        password: 'secret123',
        name: 'New User',
        role: RegisterRole.USER,
      });

      expect(usersService.create).toHaveBeenCalled();
      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(usersService.setRefreshToken).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('throws when user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.login('x@y.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('throws when user is banned', async () => {
      usersService.findByEmail.mockResolvedValue({ ...mockUser, isBanned: true } as never);

      await expect(service.login('test@example.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('clears refresh token', async () => {
      await service.logout('user-id-1');
      expect(usersService.clearRefreshToken).toHaveBeenCalledWith('user-id-1');
    });
  });
});
