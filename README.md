# Mood-Based Playlist Generator

A full-stack web application for recommending playlists based on a user's mood. The current version includes a polished mood-first frontend, backend playlist generation with Spotify/demo fallback behavior, authenticated user features backed by PostgreSQL and Prisma, and local rule-based journal mood detection.

## Current Phase

Phase 6 - Sharing and Dashboard Analytics

Implemented so far:

- React/Vite frontend with mood selection, dynamic themes, playlist results, loading/error/empty states, and responsive layouts
- Express/TypeScript backend with health, mood, and playlist generation endpoints
- Spotify Client Credentials integration on the backend only, with safe fallback playlists when Spotify is missing or unavailable
- PostgreSQL schema managed by Prisma
- JWT Bearer authentication for register, login, logout, and current-user lookup
- Password hashing with bcryptjs
- Favorite moods for authenticated users
- Playlist generation history for authenticated users
- Guest playlist generation preserved exactly as before
- Rule-based journal mood detection for the 10 supported moods
- Journal detection result UI with confidence, reason, matched signals, and generate action
- Text-based playlist generations saved with `inputType: "text"` for authenticated users
- Authenticated shareable playlist links
- Public shared playlist pages that hide private account data
- Dashboard analytics for generation totals, favorite moods, recent history, and active shares
- Authenticated shareable playlist links
- Public shared playlist pages that hide private account data
- Dashboard analytics for generation totals, favorite moods, recent history, and active shares

Not implemented yet: external/AI sentiment analysis, Spotify user OAuth, saving playlists to a user's Spotify account, advanced dashboard analytics, or deployment.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL with Prisma ORM
- Music API: Spotify Web API through backend server-side credentials, with demo fallback suggestions
- Auth: JWT Bearer tokens for this portfolio MVP
- Mood detection: free local rule-based keyword and phrase scoring

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

### Frontend

`frontend/.env` only needs the API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Backend

`backend/.env` needs database, auth, and optional Spotify values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
DATABASE_URL="postgresql://postgres:password@localhost:5432/mood_playlist_generator?schema=public"
JWT_SECRET="replace_with_a_strong_secret"
JWT_EXPIRES_IN="7d"
SPOTIFY_CLIENT_ID=""
SPOTIFY_CLIENT_SECRET=""
YOUTUBE_API_KEY=""
PLAYLIST_CACHE_TTL_SECONDS=900
PLAYLIST_DEFAULT_LIMIT=8
```

Use a strong local-only `JWT_SECRET`. Do not put database URLs, JWT secrets, Spotify credentials, or YouTube keys in frontend code.

## Database Setup

After PostgreSQL is running and `backend/.env` has a valid `DATABASE_URL`, run:

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator\backend"
npx.cmd prisma generate --schema prisma/schema.prisma
npx.cmd prisma migrate dev --schema prisma/schema.prisma --name phase_4_auth_database
npx.cmd prisma db seed --schema prisma/schema.prisma
```

The seed is idempotent and upserts the 10 supported moods.

## Spotify Setup

Spotify credentials are optional for local development. If they are missing or Spotify playlist search is unavailable, the backend returns mood-specific demo playlist suggestions with `meta.fallbackUsed = true`.

To use real Spotify playlist search:

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Log in with a Spotify account.
3. Click **Create app**.
4. Enter an app name and description.
5. Add a valid redirect URI. Phase 4 does not use Spotify user OAuth, so this is only required by Spotify app setup.
6. Save the app.
7. Open the app settings.
8. Copy the **Client ID** and **Client Secret**.
9. Paste them into `backend/.env`:

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

Public:

- `GET /api/health`
- `GET /api/moods`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/moods/detect`
- `GET /api/share/:shareId`
- `POST /api/playlists/generate`
- `POST /api/playlists/regenerate`

Protected with `Authorization: Bearer <token>`:

- `GET /api/auth/me`
- `POST /api/moods/favorites`
- `GET /api/moods/favorites`
- `DELETE /api/moods/favorites/:id`
- `GET /api/playlists/history`
- `DELETE /api/playlists/history/:id`
- `DELETE /api/playlists/history`
- `GET /api/users/dashboard`
- `POST /api/share`
- `DELETE /api/share/:shareId`

Playlist generation still works for guests. When a valid JWT is sent, successful generate/regenerate requests are saved to playlist history. Manual mood card generations save `inputType: "manual"`; journal-detected generations save `inputType: "text"` and never store the original journal text.

## Build Checks

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator"
npm.cmd run build --workspace backend
npm.cmd run build --workspace frontend
```

## Journal Mood Detection

The Home page journal box calls `POST /api/moods/detect`. The backend validates text length, rejects HTML, normalizes the text, scores mood keywords and phrases locally, and returns a detected mood, confidence, reason, and matched signals. The full journal text is not stored in the database or playlist history.

Example request:

```json
{
  "text": "I am overwhelmed with deadlines and anxiety."
}
``` 


## Sharing And Dashboard

Authenticated users can create share links for their own playlist history items. Public shared playlist pages use:

```text
http://localhost:5173/share/<shareId>
```

The backend builds share URLs from `FRONTEND_URL`. Public share responses include playlist result data, mood, source, query, and dates only. They do not expose user email, user name, JWT data, internal database ids, or journal text.

Dashboard analytics are available at `GET /api/users/dashboard` and power the frontend dashboard cards, mood counts, favorite shortcuts, recent history actions, and active share management.

## Current Limitations

- Spotify user OAuth is not implemented.
- The app cannot save playlists to a Spotify account.
- Sharing links remain placeholders for a later phase.
- Dashboard analytics/admin monitoring are not implemented.
- Spotify platform access can vary by app mode and Spotify policy; fallback suggestions keep the app usable during development.

## Future Roadmap

- Phase 7: Testing and Deployment
