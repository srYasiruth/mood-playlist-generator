export type PlaylistSource = "spotify" | "youtube" | "fallback" | "mock" | string;
export type PlaylistInputType = "manual" | "text";

export type Playlist = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  externalUrl: string;
  trackCount?: number;
  source: PlaylistSource;
  mood: string;
  coverGradient?: string;
  tracks?: PlaylistTrack[];
};

export type PlaylistTrack = {
  id: string;
  title: string;
  artist: string;
  durationMs?: number;
};

export type PlaylistGenerationResponse = {
  success: boolean;
  mood: string;
  query: string;
  source: string;
  playlists: Playlist[];
  inputType?: PlaylistInputType;
  meta?: {
    cached?: boolean;
    fallbackUsed?: boolean;
    generatedAt?: string;
    message?: string;
  };
};