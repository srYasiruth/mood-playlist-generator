import { useCallback, useState } from "react";
import {
  generatePlaylists,
  regeneratePlaylists,
  type PlaylistCatalogResult
} from "../services/playlistService";
import type { Mood } from "../types/mood";
import type { Playlist } from "../types/playlist";

export function usePlaylistMock() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<PlaylistCatalogResult | null>(null);

  const run = useCallback(async (mood: Mood, mode: "generate" | "regenerate") => {
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);

    try {
      const response = mode === "generate" ? await generatePlaylists(mood) : await regeneratePlaylists(mood);
      setPlaylists(response.playlists);
      setLastResponse(response);
      setStatusMessage(response.message ?? response.meta?.message ?? null);
      return response;
    } catch {
      const message = "We could not create playlist recommendations. Please try again.";
      setError(message);
      setPlaylists([]);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generate = useCallback((mood: Mood) => run(mood, "generate"), [run]);
  const regenerate = useCallback((mood: Mood) => run(mood, "regenerate"), [run]);

  return {
    playlists,
    setPlaylists,
    isLoading,
    error,
    statusMessage,
    setStatusMessage,
    lastResponse,
    setLastResponse,
    generate,
    regenerate
  };
}
