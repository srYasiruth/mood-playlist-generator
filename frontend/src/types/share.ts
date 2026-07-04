import type { Playlist } from "./playlist";

export type SharedPlaylistPublic = {
  shareId: string;
  mood: string;
  inputType: "manual" | "text" | string;
  source: string;
  query?: string;
  createdAt: string;
  generatedAt?: string;
  playlists: Playlist[];
};

export type CreateShareResponse = {
  success: true;
  shareId: string;
  shareUrl?: string;
  message: string;
};

export type GetSharedPlaylistResponse = {
  success: true;
  sharedPlaylist: SharedPlaylistPublic;
};