import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterRole } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService) as jest.Mocked<AuthService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('calls authService.register with dto and returns result', async () => {
      const dto: RegisterDto = { email: 'a@b.com', password: 'pass123', name: 'Test', role: RegisterRole.USER };
      mockAuthService.register.mockResolvedValue({ user: { id: '1' }, accessToken: 't', refreshToken: 'rt', expiresIn: 3600 });

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('accessToken', 't');
      expect(result).toHaveProperty('user');
    });
  });

  describe('login', () => {
    it('calls authService.login with email and password', async () => {
      const dto: LoginDto = { email: 'a@b.com', password: 'pass123' };
      mockAuthService.login.mockResolvedValue({ user: { id: '1' }, accessToken: 't', refreshToken: 'rt', expiresIn: 3600 });

      await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith('a@b.com', 'pass123');
    });
  });

  describe('refresh', () => {
    it('calls authService.refresh with token', async () => {
      mockAuthService.refresh.mockResolvedValue({ accessToken: 't', refreshToken: 'rt', expiresIn: 3600 });

      await controller.refresh('refresh-token');

      expect(authService.refresh).toHaveBeenCalledWith('refresh-token');
    });
  });

  describe('logout', () => {
    it('calls authService.logout with userId', async () => {
      mockAuthService.logout.mockResolvedValue({ message: 'Logged out successfully' });

      await controller.logout('user-id-1');

      expect(authService.logout).toHaveBeenCalledWith('user-id-1');
    });
  });
});
