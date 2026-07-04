# API Documentation

Base URL for local development: `http://localhost:5000`

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

Returns the initial static mood list.

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

## Phase 2 Frontend API Usage

The frontend attempts to load moods from `GET /api/moods` through `frontend/src/services/moodService.ts`.

If the backend is offline or unavailable, the frontend falls back to local mood metadata from `frontend/src/data/moods.ts` and shows a non-blocking message:

```text
Using local mood data. Backend is not connected.
```

No real Spotify or YouTube API calls are made in Phase 2.
