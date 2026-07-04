import { apiClient } from "./apiClient";
import type { Mood } from "../types/mood";
import type { PlaylistGenerationResponse } from "../types/playlist";

export type FavoriteMood = {
  id: string;
  mood: {
    id: string;
    key: string;
    name: string;
    description?: string;
    theme?: unknown;
  };
  createdAt: string;
};

export type PlaylistHistoryItem = {
  id: string;
  mood: string;
  inputType: string;
  searchQuery?: string;
  apiSource: string;
  resultData: PlaylistGenerationResponse;
  createdAt: string;
};

export type PlaylistHistoryResponse = {
  success: true;
  items: PlaylistHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type DashboardStats = {
  totalPlaylistsGenerated: number;
  manualGenerations: number;
  textGenerations: number;
  favoriteMoodCount: number;
  sharedPlaylistCount: number;
  mostSelectedMood: string | null;
  moodCounts: Array<{ mood: string; count: number }>;
  recentHistory: Array<{
    id: string;
    mood: string;
    inputType: string;
    searchQuery?: string | null;
    apiSource: string;
    playlistCount: number;
    createdAt: string;
  }>;
  favoriteMoods: FavoriteMood[];
  activeShares: Array<{
    shareId: string;
    shareUrl: string;
    mood: string;
    inputType: string;
    source: string;
    query?: string | null;
    createdAt: string;
  }>;
};

export async function saveFavoriteMood(mood: Mood) {
  const response = await apiClient.post<{ success: true; message: string; favorite: FavoriteMood }>(
    "/api/moods/favorites",
    { mood: mood.id }
  );
  return response.data;
}

export async function getFavoriteMoods() {
  const response = await apiClient.get<{ success: true; favorites: FavoriteMood[] }>("/api/moods/favorites");
  return response.data.favorites;
}

export async function removeFavoriteMood(id: string) {
  const response = await apiClient.delete<{ success: true; message: string }>(`/api/moods/favorites/${id}`);
  return response.data;
}

export async function getPlaylistHistory(page = 1, limit = 10) {
  const response = await apiClient.get<PlaylistHistoryResponse>("/api/playlists/history", {
    params: { page, limit }
  });
  return response.data;
}

export async function deletePlaylistHistoryItem(id: string) {
  const response = await apiClient.delete<{ success: true; message: string }>(`/api/playlists/history/${id}`);
  return response.data;
}

export async function clearPlaylistHistory() {
  const response = await apiClient.delete<{ success: true; message: string }>("/api/playlists/history");
  return response.data;
}

export async function getDashboardStats() {
  const response = await apiClient.get<{ success: true; stats: DashboardStats }>("/api/users/dashboard");
  return response.data.stats;
}