export type Playlist = {
  id: string;
  title: string;
  provider: "Spotify" | "YouTube" | "Unknown";
  externalUrl: string;
  imageUrl?: string;
  tracks?: PlaylistTrack[];
};

export type PlaylistTrack = {
  id: string;
  title: string;
  artist: string;
  durationMs?: number;
};

