# Mood-Based Playlist Generator

A full-stack web application foundation for recommending music playlists based on a user's mood. The current version includes a polished Phase 2 frontend experience with selectable moods, dynamic themes, journal-input placeholder UI, and mock playlist recommendations.

## Current Phase

Phase 2 - Core Frontend UI

This phase builds the MVP-style frontend experience. It does not implement authentication, real Spotify or YouTube calls, database persistence, journal sentiment analysis, dashboard analytics, sharing behavior, or deployment.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, TypeScript, REST API structure
- Database: PostgreSQL planned for production, Prisma ORM
- Future music API: Spotify Web API first, YouTube Data API as fallback

## Folder Structure

```text
Mood-Based Playlist Generator/
  frontend/
  backend/
  docs/
  .gitignore
  README.md
  LICENSE
  package.json
```

## Install Dependencies

From the project root:

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd install
```

## Environment Variables

Create local environment files from the examples:

```powershell
Copy-Item frontend\.env.example frontend\.env
Copy-Item backend\.env.example backend\.env
```

Never commit real `.env` files. Only `.env.example` files belong in the repository.

## Run Frontend

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd run dev --workspace frontend
```

Default local URL: `http://localhost:5173`

## Run Backend

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd run dev --workspace backend
```

Default local URL: `http://localhost:5000`

## Phase 2 Frontend Features

- Professional responsive home page
- Mood selection using 10 supported moods
- Dynamic theme/background changes based on selected mood
- Journal text input UI placeholder for Phase 5
- Generate button disabled until a mood is selected
- Mock playlist generation with loading state
- Results page with playlist cards and regenerate action
- Empty and error states
- Backend mood loading through `/api/moods`
- Graceful local fallback when backend is offline
- Consistent placeholder styling for login, register, dashboard, and shared playlist pages

## Phase 1 API Endpoints

- `GET /api/health`
- `GET /api/moods`

## Prisma Setup

The Prisma schema is configured for PostgreSQL in `backend/prisma/schema.prisma`.

Generate the Prisma client:

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator\backend"
npm.cmd run prisma:generate
```

Run a migration after configuring a real PostgreSQL `DATABASE_URL`:

```powershell
npm.cmd run prisma:migrate
```

Free PostgreSQL options for later:

- Supabase PostgreSQL
- Neon PostgreSQL
- Local PostgreSQL

Paste the connection string into `backend/.env` as `DATABASE_URL`. Do not paste credentials into source files.

## Validation Commands

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd run build --workspace frontend
npm.cmd run build --workspace backend
```

## Future Roadmap

- Phase 3: Backend API and Music API Integration
- Phase 4: Authentication and Database Features
- Phase 5: Journal Mood Detection
- Phase 6: Sharing and Dashboard
- Phase 7: Testing and Deployment
