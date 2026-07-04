# Mood-Based Playlist Generator

A full-stack music discovery app that recommends playlists based on how a user feels. Users can choose a mood manually or write a short journal entry, then receive playlist suggestions from the backend with Spotify support and safe demo fallbacks for local development.

The project is built as a production-style TypeScript monorepo with a React frontend, Express REST API, PostgreSQL persistence through Prisma, JWT authentication, favorite moods, playlist history, shareable playlist links, and a privacy-conscious dashboard.

## Highlights

- Mood-first playlist generation with 10 supported moods
- Journal-based mood detection using local rule-based scoring
- Spotify Web API integration through backend-only credentials
- Safe fallback playlist generation when Spotify is unavailable
- JWT authentication with hashed passwords
- Favorite moods and playlist history for signed-in users
- Shareable playlist links with public, sanitized shared pages
- Dashboard analytics for mood usage, generation counts, favorites, history, and active shares
- Responsive React UI with Tailwind CSS and mood-based themes
- PostgreSQL schema managed with Prisma ORM

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, TypeScript, Zod, Helmet, Morgan, Rate Limiting |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT Bearer tokens, bcryptjs password hashing |
| Music Data | Spotify Web API with local fallback playlists |
| Mood Detection | Local rule-based keyword and phrase scoring |

## Core Features

### Mood Selection

Users can select from 10 moods: happy, sad, relaxed, focused, angry, motivated, romantic, energetic, stressed, and sleepy. The UI theme adapts to the selected mood, and the backend uses trusted server-side mood mappings for playlist search.

### Journal Mood Detection

Users can write a short journal-style entry and ask the app to detect the closest mood. Detection is local and rule-based, so the app does not depend on paid AI APIs or third-party NLP services.

The detector returns:

- detected mood
- confidence score
- short explanation
- matched signals

Privacy note: journal text is not stored in the database, playlist history, API logs, shared links, or public responses.

### Playlist Generation

The backend generates playlist recommendations from a mood using Spotify Client Credentials when available. If Spotify credentials are missing or Spotify search fails, the API returns polished demo playlist suggestions so the app remains usable in development.

Guests can generate playlists. Signed-in users also get playlist history saved automatically.

### Authentication And User Data

Authenticated users can:

- register and log in
- view their profile summary
- save favorite moods
- view playlist history
- delete individual history items
- clear history
- generate playlists from favorite mood shortcuts

### Sharing

Signed-in users can create public share links for playlist history items they own. Public shared pages are accessible without login and expose only safe playlist data.

Public shared responses do not expose:

- user email
- user name
- JWT data
- password hashes
- internal user IDs
- internal playlist history IDs
- journal text

### Dashboard Analytics

The dashboard provides a compact overview of user activity:

- total playlists generated
- manual vs journal-based generations
- favorite mood count
- active share count
- most selected mood
- mood count bars
- recent history
- favorite shortcuts
- active shared links

## Project Structure

```text
mood-playlist-generator/
  frontend/              React + Vite frontend
  backend/               Express + TypeScript REST API
  backend/prisma/        Prisma schema, migrations, seed script
  docs/                  API, database, development, and UI documentation
  package.json           Workspace configuration
```

## Getting Started

### 1. Install Dependencies

```powershell
npm.cmd install
```

### 2. Configure Environment Files

Create local environment files from examples:

```powershell
Copy-Item frontend\.env.example frontend\.env
Copy-Item backend\.env.example backend\.env
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Backend:

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

Never commit real `.env` files. Spotify credentials and database secrets belong only in the backend environment.

### 3. Prepare The Database

After PostgreSQL is running and `backend/.env` contains a valid `DATABASE_URL`:

```powershell
cd backend
npx.cmd prisma generate --schema prisma/schema.prisma
npx.cmd prisma migrate dev --schema prisma/schema.prisma --name phase_4_auth_database
npx.cmd prisma db seed --schema prisma/schema.prisma
```

The seed script upserts the 10 supported moods and can be run more than once.

### 4. Run The App

Backend:

```powershell
npm.cmd run dev --workspace backend
```

Frontend:

```powershell
npm.cmd run dev --workspace frontend
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Spotify Setup

Spotify is optional for local development. Without credentials, the backend returns demo playlist suggestions.

To enable Spotify playlist search:

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Copy the Client ID and Client Secret.
3. Add them to `backend/.env`:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

This project currently uses Spotify Client Credentials for public playlist search. It does not implement Spotify user OAuth or saving playlists to a user's Spotify account.

## API Overview

### Public Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | API health check |
| GET | `/api/moods` | List supported moods |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Stateless logout response |
| POST | `/api/moods/detect` | Detect mood from journal text |
| POST | `/api/playlists/generate` | Generate playlist recommendations |
| POST | `/api/playlists/regenerate` | Regenerate playlist recommendations |
| GET | `/api/share/:shareId` | Public shared playlist page data |

### Protected Endpoints

Protected endpoints require:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/auth/me` | Current user |
| GET | `/api/moods/favorites` | List favorite moods |
| POST | `/api/moods/favorites` | Save favorite mood |
| DELETE | `/api/moods/favorites/:id` | Remove favorite mood |
| GET | `/api/playlists/history` | Playlist history |
| DELETE | `/api/playlists/history/:id` | Delete one history item |
| DELETE | `/api/playlists/history` | Clear history |
| GET | `/api/users/dashboard` | Dashboard analytics |
| POST | `/api/share` | Create share link |
| DELETE | `/api/share/:shareId` | Disable share link |

Detailed endpoint examples are documented in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## Database

The Prisma schema includes:

- `User`
- `Mood`
- `FavoriteMood`
- `PlaylistHistory`
- `SharedPlaylist`
- `ApiLog`

See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for model details and privacy notes.

## Privacy And Security

- Passwords are hashed with bcryptjs.
- JWT secrets stay in backend environment variables.
- Spotify credentials are never exposed to frontend code.
- Journal text is not stored by default.
- Public share links return sanitized playlist data only.
- Share creation and disabling require authentication.
- Share IDs are generated with crypto-safe randomness.
- Disabled share links return a safe `NOT_FOUND` response.

## Build Checks

```powershell
npm.cmd run build --workspace backend
npm.cmd run build --workspace frontend
```

## Current Limitations

- Spotify user OAuth is not implemented.
- The app cannot save playlists to a user's Spotify account.
- Mood detection is local and rule-based, not ML-based.
- Advanced admin monitoring is not implemented.
- Deployment is not configured yet.

## Roadmap

- Add automated unit and integration tests
- Add end-to-end UI tests for auth, playlist generation, sharing, and dashboard flows
- Prepare production deployment configuration
- Deploy frontend, backend, and PostgreSQL database
- Optionally add Spotify OAuth for user-owned playlist actions

## License

This project is released under the MIT License.
