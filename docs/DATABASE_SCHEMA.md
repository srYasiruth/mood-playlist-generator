# Database Schema

The project is prepared for PostgreSQL using Prisma ORM. The schema lives in `backend/prisma/schema.prisma`.

## User

Stores registered users.

- `id`: unique user id
- `name`: display name
- `email`: unique login email
- `passwordHash`: hashed password, never plaintext
- `role`: user role, defaults to `USER`
- `createdAt`: creation timestamp
- `updatedAt`: update timestamp

## Mood

Stores supported moods and metadata for playlist generation.

- `id`: unique mood id
- `name`: mood name
- `description`: optional mood description
- `keywords`: search and detection keywords
- `genres`: related music genres
- `theme`: JSON theme data for future dynamic UI
- `createdAt`: creation timestamp
- `updatedAt`: update timestamp

## FavoriteMood

Connects users to moods they save as favorites.

- `id`: unique favorite id
- `userId`: related user
- `moodId`: related mood
- `createdAt`: creation timestamp

## PlaylistHistory

Stores generated playlist request history.

- `id`: unique history id
- `userId`: optional related user
- `moodId`: optional related mood
- `moodName`: mood name snapshot
- `inputType`: manual or journal
- `journalTextSaved`: optional saved journal text
- `searchQuery`: query sent to the music provider
- `apiSource`: provider name, such as Spotify or YouTube
- `resultData`: JSON playlist result data
- `createdAt`: creation timestamp

## SharedPlaylist

Stores shareable playlist links.

- `id`: unique row id
- `shareId`: public share identifier
- `userId`: owner user id
- `playlistHistoryId`: related playlist history
- `isActive`: whether the link is active
- `createdAt`: creation timestamp
- `expiresAt`: optional expiration timestamp

## ApiLog

Stores future external provider call logs.

- `id`: unique log id
- `provider`: external provider name
- `endpoint`: provider endpoint
- `statusCode`: HTTP status code
- `success`: whether the request succeeded
- `errorMessage`: optional failure message
- `createdAt`: creation timestamp

