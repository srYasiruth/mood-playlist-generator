import { apiClient } from "./apiClient";
import type { CreateShareResponse, GetSharedPlaylistResponse } from "../types/share";

export async function createShareLink(playlistHistoryId: string) {
  const response = await apiClient.post<CreateShareResponse>("/api/share", { playlistHistoryId });
  return response.data;
}

export async function getSharedPlaylist(shareId: string) {
  const response = await apiClient.get<GetSharedPlaylistResponse>(`/api/share/${shareId}`);
  return response.data.sharedPlaylist;
}

export async function disableShareLink(shareId: string) {
  const response = await apiClient.delete<{ success: true; message: string }>(`/api/share/${shareId}`);
  return response.data;
}