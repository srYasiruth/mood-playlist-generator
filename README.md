# Mood-Based Playlist Generator

A full-stack web application foundation for recommending music playlists based on a user's mood. Later phases will add manual mood selection, journal-style mood detection, playlist generation through music APIs, authentication, saved moods, history, sharing, and dashboard features.

## Current Phase

Phase 1 - Planning and Setup

This phase creates a clean, professional, scalable project foundation. It does not implement final UI, authentication, real music API calls, sentiment analysis, dashboard analytics, sharing behavior, or deployment.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, TypeScript, REST API structure
- Database: PostgreSQL planned for production, Prisma ORM
- Future music API: Spotify Web API first, YouTube Data API as fallback

## Folder Structure

```text
mood-playlist-generator/
  frontend/
  backend/
  docs/
  .gitignore
  README.md
  LICENSE
  package.json
```

## Install Frontend

```bash
cd mood-playlist-generator/frontend
npm install
```

## Install Backend

```bash
cd mood-playlist-generator/backend
npm install
```

## Environment Variables

Copy each example file before running locally:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

On Windows PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

Never commit real `.env` files. Only `.env.example` files belong in the repository.

## Run Frontend

```bash
cd mood-playlist-generator/frontend
npm run dev
```

Default local URL: `http://localhost:5173`

## Run Backend

```bash
cd mood-playlist-generator/backend
npm run dev
```

Default local URL: `http://localhost:5000`

## Phase 1 API Endpoints

- `GET /api/health`
- `GET /api/moods`

## Prisma Setup

The Prisma schema is configured for PostgreSQL in `backend/prisma/schema.prisma`.

Generate the Prisma client:

```bash
cd mood-playlist-generator/backend
npm run prisma:generate
```

Run a migration after configuring a real PostgreSQL `DATABASE_URL`:

```bash
npm run prisma:migrate
```

Free PostgreSQL options for later:

- Supabase PostgreSQL
- Neon PostgreSQL
- Local PostgreSQL

Paste the connection string into `backend/.env` as `DATABASE_URL`. Do not paste credentials into source files.

## Future Roadmap

- Phase 2: Core Frontend
- Phase 3: Backend API and Music API Integration
- Phase 4: Authentication and Database Features
- Phase 5: Journal Mood Detection
- Phase 6: Sharing and Dashboard
- Phase 7: Testing and Deployment

