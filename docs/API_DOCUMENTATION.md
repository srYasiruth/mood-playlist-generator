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

Returns the initial static mood list for Phase 1.

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

The full Phase 1 mood list is:

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

