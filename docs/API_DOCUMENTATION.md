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

Supported error codes:

- `INVALID_INPUT`
- `INVALID_MOOD`
- `API_ERROR`
- `NOT_FOUND`
- `RATE_LIMITED`
- `SERVER_ERROR`
- `SPOTIFY_NOT_CONFIGURED`

## GET /api/health

Checks whether the backend API is running.

### Response

```json
{
  "success": true,
  "message": "Mood-Based Playlist Generator API is running"
}
```

## GET /api/moods

Returns the initial static mood list used by the frontend.

### Response

```json
{
  "success": true,
  "message": "Moods retrieved successfully",
  "data": [
    { "id": "happy", "name": "Happy" },
    { "id": "sad", "name": "Sad" },
    { "id": "relaxed", "name": "Relaxed" }
  ]
}
```

The full mood list is:

- Happy
- Sad
- Relaxed
- Focused
- Angry
- Motivated
- Romantic
- Energetic
- Stressed
- Sleepy

## POST /api/playlists/generate

Generates playlist recommendations for a supported mood. The backend uses Spotify when credentials are configured and returns fallback demo suggestions when Spotify is not configured or unavailable.

### Request

```json
{
  "mood": "focused",
  "source": "spotify",
  "limit": 8
}
```

### Rules

- `mood` is required.
- `source` is optional and defaults to `spotify`.
- Supported sources: `spotify`, `fallback`.
- `limit` is optional and defaults to `PLAYLIST_DEFAULT_LIMIT` or `8`.
- `limit` must be between `1` and `20`.
- `mood` must be one of the supported mood ids.

### Success Response

```json
{
  "success": true,
  "mood": "focused",
  "query": "lofi study",
  "source": "spotify",
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
  "playlists": [
    {
      "id": "fallback-happy-1",
      "title": "Happy Starter Mix",
      "description": "Bright songs for a lifted, sunny mood. Demo playlist based on feel good music and pop cues.",
      "imageUrl": "data:image/svg+xml;charset=UTF-8,...",
      "externalUrl": "https://open.spotify.com/search/feel%20good%20music",
      "trackCount": 20,
      "source": "fallback",
      "mood": "happy"
    }
  ],
  "meta": {
    "cached": false,
    "fallbackUsed": true,
    "generatedAt": "2026-07-04T00:00:00.000Z",
    "message": "Using demo playlist suggestions. Spotify is not configured yet."
  }
}
```

### Invalid Mood Example

```json
{
  "success": false,
  "message": "Invalid mood selected.",
  "errorCode": "INVALID_MOOD"
}
```

### Invalid Input Example

```json
{
  "success": false,
  "message": "Invalid playlist generation request.",
  "errorCode": "INVALID_INPUT"
}
```

## POST /api/playlists/regenerate

Regenerates playlist recommendations using the same request shape as `/api/playlists/generate`. The service attempts to rotate to a different mood query where possible.

### Request

```json
{
  "mood": "happy",
  "source": "spotify",
  "limit": 8
}
```

### Response

The response shape is the same as `/api/playlists/generate`.

## Phase 3 Frontend API Usage

The frontend uses `frontend/src/services/playlistService.ts` to call:

- `POST /api/playlists/generate`
- `POST /api/playlists/regenerate`

If the backend is offline, the frontend falls back to local playlist data and shows:

```text
Using local playlist data. Backend is not connected.
```

No Spotify credentials are exposed to the frontend.
