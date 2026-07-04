import { useCallback, useState } from "react";
import { generateMockPlaylists } from "../services/playlistService";
import type { Mood } from "../types/mood";
import type { Playlist } from "../types/playlist";

export function usePlaylistMock() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (mood: Mood) => {
    setIsLoading(true);
    setError(null);

    try {
      const generatedPlaylists = await generateMockPlaylists(mood);
      setPlaylists(generatedPlaylists);
      return generatedPlaylists;
    } catch {
      const message = "We could not create mock playlist recommendations. Please try again.";
      setError(message);
      setPlaylists([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    playlists,
    setPlaylists,
    isLoading,
    error,
    generate
  };
}
