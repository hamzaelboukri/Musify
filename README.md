# Musify - Music Streaming Platform

A full-stack music streaming web platform built with Next.js, NestJS, and MongoDB.

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: NestJS
- **Database**: MongoDB
- **Authentication**: JWT
- **Architecture**: REST API

## Roles

- **USER**: Listen to music, create playlists, favorites, search, follow singers
- **SINGER**: Upload songs, manage songs, view statistics (requires admin approval)
- **ADMIN**: Manage users, approve singers/songs, delete content, monitor platform

## Spotify Connect Logic

One account can stream on ONE device at a time. Starting playback on a new device stops the previous session or blocks the new device.

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Installation

```bash
# Backend - install dependencies (creates backend/node_modules)
cd backend
npm install

# Frontend - install dependencies (creates frontend/node_modules)
cd frontend
npm install
```

### Environment Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Copy `frontend/.env.example` to `frontend/.env.local`
3. Configure MongoDB URI and JWT secrets

### Run Development

```bash
# Terminal 1 - Backend (http://localhost:3001)
cd backend
npm run start:dev

# Terminal 2 - Frontend (http://localhost:3000)
cd frontend
npm run dev
```

### Seed Database

```bash
cd backend
npm run seed
```

### Default Credentials (after seeding)

- **Admin**: admin@musify.com / Admin123!
- **Singer**: singer@musify.com / Singer123!
- **User**: user@musify.com / User123!

## Project Structure

```
musify/
├── backend/          # NestJS API (has its own node_modules)
├── frontend/         # Next.js App (has its own node_modules)
└── README.md
```

No monorepo. Each folder is a separate project with its own `package.json` and `node_modules`.

## Docker

### Full stack (MongoDB + Backend + Frontend)

```bash
docker compose up -d --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- MongoDB: localhost:27017

### Seed database (after Docker is running)

```bash
docker compose exec backend npm run seed:prod
```

## API Documentation

See `API_ENDPOINTS.md` for complete REST API documentation.
