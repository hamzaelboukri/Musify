# Musify REST API Endpoints

Base URL: `http://localhost:3001/api`

## Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register (body: name, email, password, role?) |
| POST | `/auth/login` | Login (body: email, password) |
| POST | `/auth/refresh` | Refresh token (body: refreshToken) |
| POST | `/auth/logout` | Logout (Bearer token) |

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get profile |
| PATCH | `/users/me` | Update profile (body: name) |
| POST | `/users/follow/:singerId` | Follow singer |
| POST | `/users/unfollow/:singerId` | Unfollow singer |

## Songs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/songs` | List songs (?genre, ?artist, ?search, ?skip, ?limit) |
| GET | `/songs/trending` | Trending songs (?limit=10) |
| GET | `/songs/:id` | Get song by ID |
| GET | `/songs/singer/:singerId` | Songs by singer (auth) |

## Playlists

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/playlists` | Create (body: name) |
| GET | `/playlists` | My playlists |
| GET | `/playlists/:id` | Get playlist |
| PATCH | `/playlists/:id` | Update (body: name) |
| DELETE | `/playlists/:id` | Delete playlist |
| POST | `/playlists/:id/songs/:songId` | Add song |
| DELETE | `/playlists/:id/songs/:songId` | Remove song |

## Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/favorites` | Get favorites |
| POST | `/favorites/:songId` | Add to favorites |
| DELETE | `/favorites/:songId` | Remove from favorites |
| GET | `/favorites/check/:songId` | Check if favorite |

## Singers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/singers/apply` | Apply as singer (body: stageName, bio?) |
| GET | `/singers/me` | My singer profile |
| GET | `/singers` | All approved singers |
| GET | `/singers/:id` | Singer by ID |
| POST | `/singers/songs` | Upload song |
| GET | `/singers/songs/me` | My songs |
| PATCH | `/singers/songs/:songId` | Update song |
| DELETE | `/singers/songs/:songId` | Delete song |
| GET | `/singers/stats/me` | My statistics |

## Streaming (Spotify Connect)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/streaming/start` | Start session (body: deviceId, accessToken, action?) |
| DELETE | `/streaming/stop` | Stop session (body: deviceId?) |
| POST | `/streaming/check` | Check if device allowed (body: deviceId) |
| POST | `/streaming/play` | Record play (body: songId, deviceId) |

## Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats/history` | Listening history (?limit) |

## Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sessions/me` | My sessions |
| GET | `/sessions/active` | All active (Admin) |

## Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Platform stats |
| GET | `/admin/users` | List users |
| POST | `/admin/users/:userId/ban` | Ban user |
| POST | `/admin/users/:userId/unban` | Unban user |
| GET | `/admin/singers/pending` | Pending singers |
| POST | `/admin/singers/:singerId/approve` | Approve singer |
| POST | `/admin/singers/:singerId/reject` | Reject singer |
| GET | `/admin/songs/pending` | Pending songs |
| POST | `/admin/songs/:songId/approve` | Approve song |
| DELETE | `/admin/songs/:songId` | Delete song |
| GET | `/admin/sessions` | Active sessions |
