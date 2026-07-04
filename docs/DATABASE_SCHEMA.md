# Database Schema

The project uses PostgreSQL with Prisma ORM. The schema lives in `backend/prisma/schema.prisma`.

## Setup Commands

```powershell
cd "D:\PROJECTS\Mood-Based Playlist Generator\backend"
npx.cmd prisma generate --schema prisma/schema.prisma
npx.cmd prisma migrate dev --schema prisma/schema.prisma --name phase_4_auth_database
npx.cmd prisma db seed --schema prisma/schema.prisma
```

The seed script upserts the 10 supported moods and is safe to run more than once.

## User

Stores registered users.

- `id`: UUID primary key
- 
ame`: display name
- `email`: unique login email
- `passwordHash`: hashed password, never returned to the frontend
- `role`: user role, defaults to `USER`
- `createdAt`: creation timestamp
- `updatedAt`: update timestamp
- Relations: favorite moods, playlist history, shared playlists

## Mood

Stores supported moods and metadata used by favorite moods and future database-backed mood features.

- `id`: UUID primary key
- `key`: unique lowercase mood key such as `happy` or `focused`
- 
ame`: display name
- `description`: short mood description
- `keywords`: JSON keyword/search metadata
- `genres`: JSON genre metadata
- `theme`: JSON theme metadata for future dynamic UI support
- `createdAt`: creation timestamp
- `updatedAt`: update timestamp
- Relations: favorite moods

Seeded mood keys:

- `happy`
- `sad`
- `relaxed`
- `focused`
- `angry`
- `motivated`
- `romantic`
- `energetic`
- `stressed`
- `sleepy`

## FavoriteMood

Connects users to moods they save as favorites.

- `id`: UUID primary key
- `userId`: owning user id
- `moodId`: related mood id
- `createdAt`: creation timestamp
- Unique constraint: `userId + moodId`

## PlaylistHistory

Stores authenticated users' generated playlist snapshots.

- `id`: UUID primary key
- `userId`: owning user id
- `mood`: mood key snapshot
- `inputType`: defaults to `manual`
- `journalTextSaved`: defaults to `false`
- `searchQuery`: query used by the playlist service
- `apiSource`: source used, such as `spotify` or `fallback`
- `resultData`: JSON normalized playlist response snapshot
- `createdAt`: creation timestamp

Guest playlist generation does not create history records. Journal-based generation stores `inputType: "text"` and keeps `journalTextSaved: false`; the original journal text is not stored in this table or inside `resultData`.

## SharedPlaylist

Stores active and disabled public playlist share links. Real sharing is implemented in Phase 6 using soft-disable behavior.

- `id`: UUID primary key
- `shareId`: unique crypto-random public share identifier
- `userId`: optional owner user id
- `playlistHistoryId`: optional playlist history id
- `isActive`: defaults to `true`; disabled links are soft-disabled with `false`
- `createdAt`: creation timestamp
- `expiresAt`: optional expiration timestamp

## ApiLog

Prepared for later provider logging or admin monitoring.

- `id`: UUID primary key
- `provider`: external provider name
- `endpoint`: provider endpoint
- `statusCode`: optional HTTP status code
- `success`: whether the request succeeded
- `errorMessage`: optional failure message
- `createdAt`: creation timestamp

## Phase 6 Migration Status

No Phase 6 Prisma migration was required because `SharedPlaylist` already had the needed fields and relations.

## Phase 6 Migration Status

No Phase 6 Prisma migration was required because `SharedPlaylist` already had the needed fields and relations.
