# API Documentation

Base URL for local development: `http://localhost:5000`

## Error Format

```json
{
  "success": false,
  "message": "Invalid mood selected.",
  "errorCode": "INVALID_MOOD"
}
```

Common error codes:

- `INVALID_INPUT`
- `INVALID_MOOD`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `RATE_LIMITED`
- `API_ERROR`
- `SERVER_ERROR`
- `SPOTIFY_NOT_CONFIGURED`

## Authentication

Protected endpoints require this header:

```http
Authorization: Bearer <accessToken>
```

JWT tokens are issued by register and login. The frontend stores the token in localStorage for this portfolio MVP and attaches it through the Axios API client.

## GET /api/health

Checks whether the backend API is running.

### Response

```json
{
  "success": true,
  "message": "Mood-Based Playlist Generator API is running"
}
```

## POST /api/auth/register

Creates a user, hashes the password, and returns a JWT.

### Request

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Response

```json
{
  "success": true,
  "message": "Registration successful.",
  "user": {
    "id": "user_id",
    "name": "Test User",
    "email": "test@example.com",
    "role": "USER"
  },
  "accessToken": "jwt_token"
}
```

## POST /api/auth/login

Authenticates a user and returns a JWT. Invalid credentials return `UNAUTHORIZED` without revealing whether the email or password was wrong.

### Request

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

## GET /api/auth/me

Protected. Returns the current authenticated user.

## POST /api/auth/logout

Returns success for stateless JWT logout. The frontend removes the local token and user.

## GET /api/moods

Returns the 10 supported moods for the frontend.


## POST /api/moods/detect

Public. Detects the closest supported mood from a short journal entry using local rule-based keyword and phrase scoring. This endpoint does not require authentication and does not store the journal text.

### Request

```json
{
  "text": "I feel tired and stressed after studying all day."
}
```

### Validation

- `text` is required.
- `text` must be a string.
- Trimmed text must be 5 to 500 characters.
- HTML is rejected.
- Unsafe raw journal text is not echoed back.

### Success Response

```json
{
  "success": true,
  "detectedMood": "stressed",
  "mood": {
    "id": "database_mood_id",
    "name": "Stressed",
    "slug": "stressed",
    "description": "Grounding music for easing pressure and tension."
  },
  "confidence": 0.82,
  "reason": "Your text includes stress, pressure, or anxiety-related words.",
  "matchedSignals": ["stressed", "studying", "tired"]
}
```

### Invalid Input Example

```json
{
  "success": false,
  "message": "Journal text must be between 5 and 500 characters.",
  "errorCode": "INVALID_INPUT"
}
```
## POST /api/moods/favorites

Protected. Saves a mood as a favorite for the current user.

### Request

```json
{
  "mood": "happy"
}
```

### Response

```json
{
  "success": true,
  "message": "Favorite mood saved.",
  "favorite": {
    "id": "favorite_id",
    "mood": {
      "id": "mood_id",
      "key": "happy",
      "name": "Happy",
      "description": "Bright and upbeat mood for feel-good listening.",
      "theme": {}
    },
    "createdAt": "2026-07-04T00:00:00.000Z"
  }
}
```

Saving the same mood twice is idempotent.

## GET /api/moods/favorites

Protected. Returns the current user's saved favorite moods.

## DELETE /api/moods/favorites/:id

Protected. Removes only the current user's favorite mood record.

## POST /api/playlists/generate

Generates playlist recommendations for a supported mood. Guests can use this endpoint. Authenticated users automatically get a playlist history record after successful generation.

### Request

```json
{
  "mood": "focused",
  "source": "spotify",
  "limit": 8,
  "inputType": "manual"
}
```

### Success Response

```json
{
  "success": true,
  "mood": "focused",
  "query": "lofi study",
  "source": "spotify",
  "inputType": "manual",
  "playlists": [
    {
      "id": "spotify_playlist_id",
      "title": "Deep Focus",
      "description": "Music for concentration and studying",
      "imageUrl": "https://example.com/image.jpg",
      "externalUrl": "https://open.spotify.com/playlist/spotify_playlist_id",
      "trackCount": 50,
      "source": "spotify",
      "mood": "focused"
    }
  ],
  "meta": {
    "cached": false,
    "fallbackUsed": false,
    "generatedAt": "2026-07-04T00:00:00.000Z"
  }
}
```

### Fallback Response Example

```json
{
  "success": true,
  "mood": "happy",
  "query": "feel good music",
  "source": "fallback",
  "inputType": "manual",
  "playlists": [],
  "meta": {
    "cached": false,
    "fallbackUsed": true,
    "generatedAt": "2026-07-04T00:00:00.000Z",
    "message": "Using demo playlist suggestions. Spotify is not configured yet."
  }
}
```

## POST /api/playlists/regenerate

Uses the same request and response shape as generate. Authenticated regenerate requests are also saved to playlist history. Use `inputType: "text"` when the user accepted a detected journal mood.

## GET /api/playlists/history

Protected. Returns paginated playlist generation history for the current user.

### Query Params

- `page`: default `1`
- `limit`: default `10`

### Response

```json
{
  "success": true,
  "items": [
    {
      "id": "history_id",
      "mood": "happy",
      "inputType": "manual",
      "journalTextSaved": false,
      "searchQuery": "happy hits",
      "apiSource": "spotify",
      "resultData": {},
      "createdAt": "2026-07-04T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## DELETE /api/playlists/history/:id

Protected. Deletes one history item owned by the current user.

## DELETE /api/playlists/history

Protected. Clears all playlist history for the current user only.


## POST /api/share

Protected. Creates or returns an existing active share link for a playlist history item owned by the authenticated user.

### Request

```json
{
  "playlistHistoryId": "history_id"
}
```

### Response

```json
{
  "success": true,
  "shareId": "secure_random_share_id",
  "shareUrl": "http://localhost:5173/share/secure_random_share_id",
  "message": "Share link created successfully."
}
```

Rules:

- Requires `Authorization: Bearer <token>`.
- The playlist history item must belong to the authenticated user.
- Existing active share links for the same history item are reused.
- Share ids are generated with crypto-safe randomness.

## GET /api/share/:shareId

Public. Returns a sanitized shared playlist payload. Authentication is not required.

### Response

```json
{
  "success": true,
  "sharedPlaylist": {
    "shareId": "secure_random_share_id",
    "mood": "happy",
    "inputType": "manual",
    "source": "spotify",
    "query": "happy hits",
    "createdAt": "2026-07-04T00:00:00.000Z",
    "playlists": []
  }
}
```

Privacy: this response does not include user email, user name, JWT data, `userId`, `playlistHistoryId`, password hashes, or journal text.

## DELETE /api/share/:shareId

Protected. Soft-disables a share link owned by the authenticated user.

### Response

```json
{
  "success": true,
  "message": "Share link disabled successfully."
}
```

Inactive or disabled links return `NOT_FOUND` from the public endpoint.

## GET /api/users/dashboard

Protected. Returns compact dashboard analytics for the current user only.

### Response

```json
{
  "success": true,
  "stats": {
    "totalPlaylistsGenerated": 12,
    "manualGenerations": 7,
    "textGenerations": 5,
    "favoriteMoodCount": 3,
    "sharedPlaylistCount": 2,
    "mostSelectedMood": "focused",
    "moodCounts": [
      { "mood": "focused", "count": 4 }
    ],
    "recentHistory": [],
    "favoriteMoods": [],
    "activeShares": []
  }
}
```

## Frontend API Behavior

The frontend prefers backend responses. If the backend is offline, mood and playlist flows fall back to local demo data and show a non-blocking message. Journal mood detection requires the backend because it runs on the server. Authenticated saving, favorites, history, dashboard analytics, and share creation require the backend and database to be running. Public shared playlist pages do not require authentication.

Privacy: the full journal text is not stored in `PlaylistHistory`, `ApiLog`, or playlist result snapshots. Authenticated text-based generations save only `inputType: "text"`, `journalTextSaved: false`, mood, query, source, and normalized playlist result data.
