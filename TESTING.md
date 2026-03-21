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
  - **Contrôleurs** : `AuthController`, `SongsController` (mock des services)
  - **Services** : `AuthService`, `SongsService`, `UsersService`, `PlaylistsService`, `FavoritesService` (mocks Mongoose)
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

- **Unitaires** : `utils/coverImage.test.ts`, `components/Pagination.test.tsx` (React Testing Library).

## Tout lancer (racine du repo)

Depuis deux terminaux ou en chaîne :

```bash
cd backend && npm test && npm run test:e2e
cd ../frontend && npm test
```
