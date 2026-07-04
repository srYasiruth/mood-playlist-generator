# Mood-Based Playlist Generator

A full-stack web application for recommending playlists based on a user's mood. The current version includes a polished frontend mood experience and a backend playlist generation API that can use Spotify Web API when credentials are configured, with safe demo fallbacks for local development.

## Current Phase

Phase 3 - Backend Playlist Generation API

Implemented in this phase:

- `POST /api/playlists/generate`
- `POST /api/playlists/regenerate`
- Server-side trusted mood-to-query mapping
- Spotify Client Credentials integration on the backend only
- Spotify access-token caching
- Playlist response normalization
- Mood-specific backend fallback playlists
- In-memory playlist response cache
- Endpoint validation and rate limiting
- Frontend connection to the real backend endpoint
- Frontend fallback when backend is offline

Not implemented in this phase: authentication, JWT, database persistence, playlist history, favorite moods, real sharing, journal sentiment analysis, Spotify user OAuth, or saving playlists to a user's Spotify account.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL planned for production, Prisma ORM schema already exists
- Music API: Spotify Web API through backend server-side credentials

## Install Dependencies

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd install
```

## Environment Variables

Create local environment files from examples:

```powershell
Copy-Item frontend\.env.example frontend\.env
Copy-Item backend\.env.example backend\.env
```

Never commit real `.env` files. Only `.env.example` files belong in the repository.

## Spotify Setup

Spotify credentials are optional for local development. If they are missing, the backend returns mood-specific demo playlist suggestions with `meta.fallbackUsed = true`.

To use real Spotify playlist search:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Log in with a Spotify account.
3. Click **Create app**.
4. Enter an app name and description.
5. Add any valid redirect URI for now, such as `http://localhost:5173`, even though Phase 3 does not use user OAuth.
6. Save the app.
7. Open the app settings.
8. Copy the **Client ID**.
9. Click to reveal/copy the **Client Secret**.
10. Paste them into `backend/.env`:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

Do not put Spotify credentials in `frontend/.env` or frontend source code.

## Run Backend

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd run dev --workspace backend
```

Default backend URL: `http://localhost:5000`

## Run Frontend

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd run dev --workspace frontend
```

Default frontend URL: `http://localhost:5173`

## Current API Endpoints

- `GET /api/health`
- `GET /api/moods`
- `POST /api/playlists/generate`
- `POST /api/playlists/regenerate`

Example playlist request:

```json
{
  "mood": "focused",
  "source": "spotify",
  "limit": 8
}
```

If Spotify credentials are configured, the backend searches Spotify playlists. If credentials are missing or Spotify is unavailable, the backend returns safe demo playlist suggestions.

## Build Checks

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd run build --workspace backend
npm.cmd run build --workspace frontend
```

## Current Limitations

- Spotify user OAuth is not implemented.
- The app cannot save playlists to a Spotify account.
- Playlist history is not persisted to PostgreSQL yet.
- Journal mood detection remains a UI placeholder.
- Sharing and dashboard features remain placeholders.
- Spotify platform access can vary by app mode and Spotify policy; fallback suggestions keep the app usable during development.

## Future Roadmap

- Phase 4: Authentication and Database Features
- Phase 5: Journal Mood Detection
- Phase 6: Sharing and Dashboard
- Phase 7: Testing and Deployment
