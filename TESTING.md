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

- **Unitaires** : `AuthService`, `SongsService` (mocks Mongoose).
- **E2E** : API `GET /api/songs/stats` et `GET /api/songs/count` via Supertest + `mongodb-memory-server` (pas besoin de MongoDB local).

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
