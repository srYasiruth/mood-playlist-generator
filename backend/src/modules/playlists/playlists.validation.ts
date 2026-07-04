import { z } from "zod";
import { env } from "../../config/env";
import { supportedMoodIds } from "../../utils/moodMapping";
import { PlaylistApiError, type PlaylistGenerationRequest } from "./playlists.types";

const playlistRequestSchema = z.object({
  mood: z.string({ required_error: "Mood is required." }).trim().toLowerCase().min(1),
  source: z.enum(["spotify", "fallback"]).default("spotify"),
  limit: z.coerce.number().int().min(1).max(20).default(env.PLAYLIST_DEFAULT_LIMIT)
});

export function validatePlaylistRequest(body: unknown): PlaylistGenerationRequest {
  const parsed = playlistRequestSchema.safeParse(body);

  if (!parsed.success) {
    throw new PlaylistApiError("Invalid playlist generation request.", "INVALID_INPUT", 400);
  }

  if (!supportedMoodIds.includes(parsed.data.mood)) {
    throw new PlaylistApiError("Invalid mood selected.", "INVALID_MOOD", 400);
  }

  return parsed.data;
}
