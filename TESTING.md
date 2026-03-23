# Tests Musify (unitaires & e2e)

## Backend (NestJS + Jest)

```bash
cd backend
npm install
npm test              # tests unitaires (*.spec.ts dans src/)
npm run test:watch    # mode watch
npm run test:cov      # avec couverture
npm run test:e2e      # tests HTTP + MongoDB en mémoire (test/app.e2e-spec.ts)
```

- **Unitaires** :
  - **Contrôleurs** : `AuthController`, `SongsController`, `PlaylistsController`, `FavoritesController`, `AlbumsController`, `UsersController`, `SingersController`, `StatsController`, `AdminController`, `SessionsController`, `StreamingController`, `UploadController`, `UploadsServeController` (mock des services)
  - **Services** : `AuthService`, `SongsService`, `UsersService`, `PlaylistsService`, `FavoritesService`, `AlbumsService`, `SingersService`, `StatsService`, `AdminService`, `SessionsService`, `StreamingService`, `S3Service` (mocks Mongoose / dépendances)
- **E2E** : API `GET /api/songs/stats` et `GET /api/songs/count` via Supertest + `mongodb-memory-server` (pas besoin de MongoDB local).
- **Intégration frontend-backend** : `npm run test:integration` — teste le flux complet :
  - **Auth** : register, login, rejet mot de passe incorrect
  - **Songs** : liste, stats (lecture/catalogue)
  - **Playlists** : création, liste (avec JWT)
  - **Favoris** : liste (avec JWT), protection 401 sans token

## Frontend (Next.js + Vitest)

```bash
cd frontend
npm install
npm test              # vitest run
npm run test:watch    # vitest en continu
npm run test:cov      # couverture (nécessite @vitest/coverage-v8)
```

- **Unitaires** : `utils/coverImage.test.ts`, `components/Pagination.test.tsx`, `components/SongCard.test.tsx`, `components/AlbumCard.test.tsx`, `components/MusicPlayer.test.tsx`, `components/Sidebar.test.tsx`, `components/AddToPlaylistDialog.test.tsx`, `components/PlaylistCard.test.tsx`, `components/SingerCard.test.tsx`, `components/ThemeToggle.test.tsx` (React Testing Library). Vitest exclut le dossier `e2e/` (tests Playwright).

## E2E navigateur (Playwright) – parcours utilisateur

Simule un vrai utilisateur : connexion, écoute, création de playlist.

**Prérequis** :
1. Backend + MongoDB en cours d'exécution (`docker compose up -d` ou `cd backend && npm run start:dev`)
2. Base de données seedée : `cd backend && npm run seed`

```bash
cd frontend
npm install
npx playwright install chromium   # première fois : installer le navigateur
npm run test:e2e
```

Ou en mode UI : `npm run test:e2e:ui`

**Parcours couverts** :
- Login avec user@musify.com / User123!
- Clic sur « Play all » pour lancer la lecture
- Navigation vers Library (playlists), création d’une playlist

## Tout lancer (racine du repo)

```powershell
# Backend
cd backend; npm test; npm run test:e2e

# Frontend
cd frontend; npm test

# E2E navigateur (backend + mongo doivent tourner)
cd frontend; npm run test:e2e
```
