import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { SingersService } from '../singers/singers.service';
import { SongsService } from '../songs/songs.service';
import { SessionsService } from '../sessions/sessions.service';
import { User } from '../users/schemas/user.schema';
import { Song } from '../songs/schemas/song.schema';
import { SingerProfile } from '../singers/schemas/singer-profile.schema';
import { Playlist } from '../playlists/schemas/playlist.schema';

describe('AdminService', () => {
  let service: AdminService;
  let usersService: jest.Mocked<UsersService>;
  let singersService: jest.Mocked<SingersService>;
  let songsService: jest.Mocked<SongsService>;
  let sessionsService: jest.Mocked<SessionsService>;

  beforeEach(async () => {
    const mockUsersService = {
      findAll: jest.fn().mockResolvedValue([]),
      banUser: jest.fn(),
      unbanUser: jest.fn(),
    };
    const mockSingersService = {
      getPendingApproval: jest.fn().mockResolvedValue([]),
      approve: jest.fn(),
      reject: jest.fn(),
    };
    const mockSongsService = {
      getPendingApproval: jest.fn().mockResolvedValue([]),
      approve: jest.fn(),
      delete: jest.fn(),
    };
    const mockSessionsService = {
      getAllActiveSessions: jest.fn().mockResolvedValue([]),
    };
    const mockUserModel = {
      countDocuments: jest.fn().mockResolvedValue(0),
    };
    const mockSongModel = {
      find: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }) }) }) }),
      countDocuments: jest.fn().mockResolvedValue(0),
      aggregate: jest.fn().mockResolvedValue([{ total: 0 }]),
    };
    const mockSingerModel = { countDocuments: jest.fn().mockResolvedValue(0) };
    const mockPlaylistModel = { countDocuments: jest.fn().mockResolvedValue(0) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: SingersService, useValue: mockSingersService },
        { provide: SongsService, useValue: mockSongsService },
        { provide: SessionsService, useValue: mockSessionsService },
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Song.name), useValue: mockSongModel },
        { provide: getModelToken(SingerProfile.name), useValue: mockSingerModel },
        { provide: getModelToken(Playlist.name), useValue: mockPlaylistModel },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('getUsers delegates to usersService.findAll', async () => {
    await service.getUsers(0, 20);
    expect(usersService.findAll).toHaveBeenCalledWith(0, 20);
  });
});
