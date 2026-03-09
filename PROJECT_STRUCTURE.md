# Musify - Project Structure

## Full Folder Structure

```
musify/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── users/
│   │   │   ├── schemas/
│   │   │   │   └── user.schema.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   ├── singers/
│   │   │   ├── schemas/
│   │   │   │   └── singer-profile.schema.ts
│   │   │   ├── singers.controller.ts
│   │   │   ├── singers.module.ts
│   │   │   └── singers.service.ts
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.module.ts
│   │   │   └── admin.service.ts
│   │   ├── songs/
│   │   │   ├── schemas/
│   │   │   │   └── song.schema.ts
│   │   │   ├── dto/
│   │   │   │   └── create-song.dto.ts
│   │   │   ├── songs.controller.ts
│   │   │   ├── songs.module.ts
│   │   │   └── songs.service.ts
│   │   ├── playlists/
│   │   │   ├── schemas/
│   │   │   │   └── playlist.schema.ts
│   │   │   ├── playlists.controller.ts
│   │   │   ├── playlists.module.ts
│   │   │   └── playlists.service.ts
│   │   ├── favorites/
│   │   │   ├── favorites.controller.ts
│   │   │   ├── favorites.module.ts
│   │   │   └── favorites.service.ts
│   │   ├── sessions/
│   │   │   ├── schemas/
│   │   │   │   └── session.schema.ts
│   │   │   ├── sessions.controller.ts
│   │   │   ├── sessions.module.ts
│   │   │   └── sessions.service.ts
│   │   ├── streaming/
│   │   │   ├── streaming.controller.ts
│   │   │   ├── streaming.module.ts
│   │   │   └── streaming.service.ts
│   │   ├── stats/
│   │   │   ├── schemas/
│   │   │   │   └── listening-history.schema.ts
│   │   │   ├── stats.controller.ts
│   │   │   ├── stats.module.ts
│   │   │   └── stats.service.ts
│   │   ├── common/
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   ├── public.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   └── guards/
│   │   │       ├── jwt-auth.guard.ts
│   │   │       └── roles.guard.ts
│   │   ├── seed/
│   │   │   └── seed.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── .env.example
│   ├── nest-cli.json
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── home/
│   │   │   └── page.tsx
│   │   ├── player/
│   │   │   └── page.tsx
│   │   ├── playlists/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── favorites/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── singer-dashboard/
│   │   │   └── page.tsx
│   │   ├── admin-dashboard/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AdminTable.tsx
│   │   ├── MusicPlayer.tsx
│   │   ├── Navbar.tsx
│   │   ├── PlaylistCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SingerCard.tsx
│   │   └── SongCard.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── PlayerContext.tsx
│   ├── hooks/
│   │   └── useProtectedRoute.ts
│   ├── services/
│   │   ├── adminService.ts
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── favoriteService.ts
│   │   ├── playlistService.ts
│   │   ├── singerService.ts
│   │   ├── songService.ts
│   │   ├── statsService.ts
│   │   └── streamService.ts
│   ├── .env.example
│   ├── .env.local
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
├── API_ENDPOINTS.md
├── PROJECT_STRUCTURE.md
├── README.md
└── package.json
```

## Sample REST Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/users/me` | Yes | Get profile |
| GET | `/api/songs` | No | List songs |
| GET | `/api/songs/trending` | No | Trending songs |
| POST | `/api/streaming/start` | Yes | Start session (deviceId, accessToken) |
| POST | `/api/streaming/play` | Yes | Record play (songId, deviceId) |

See `API_ENDPOINTS.md` for the complete list.
