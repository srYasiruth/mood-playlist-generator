import type { Playlist } from "../types/playlist";

export async function getPlaceholderPlaylists(): Promise<Playlist[]> {
  return [
    {
      id: "placeholder",
      title: "Playlist API integration will be added later",
      provider: "Spotify",
      externalUrl: ""
    }
  ];
}

