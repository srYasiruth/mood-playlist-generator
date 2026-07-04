export type PlaylistSource = "Spotify" | "YouTube" | "Mock";

export type Playlist = {
  id: string;
  title: string;
  description: string;
  provider: PlaylistSource;
  externalUrl: string;
  coverGradient: string;
  trackCount: number;
  moodTag: string;
  tracks?: PlaylistTrack[];
};

export type PlaylistTrack = {
  id: string;
  title: string;
  artist: string;
  durationMs?: number;
};
