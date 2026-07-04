import { AxiosError } from "axios";
import type { Mood } from "../types/mood";
import type { Playlist, PlaylistGenerationResponse } from "../types/playlist";
import { apiClient } from "./apiClient";

const playlistMoods = ["First Spark", "Deep Current", "Late Night Signal", "Open Window"];
const sourceCycle: Playlist["source"][] = ["fallback", "fallback", "mock", "fallback"];

export type PlaylistCatalogResult = PlaylistGenerationResponse & {
  usingLocalFallback?: boolean;
  message?: string;
};

function buildTrackTitles(mood: Mood, playlistIndex: number) {
  const keyword = mood.keywords[playlistIndex % mood.keywords.length] ?? mood.name;
  return [
    `${mood.name} ${playlistIndex + 1}`,
    `${keyword} pulse`,
    `${mood.genres[0] ?? "mixed"} drift`
  ];
}

function localMockResponse(mood: Mood, message: string): PlaylistCatalogResult {
  const playlists = playlistMoods.map((label, index) => ({
    id: `local-${mood.id}-${index + 1}`,
    title: `${mood.name} ${label}`,
    description: `A ${mood.description.toLowerCase()} Built from ${mood.keywords
      .slice(0, 3)
      .join(", ")} mood cues.`,
    source: sourceCycle[index],
    externalUrl: "#",
    coverGradient: mood.theme.coverGradient,
    trackCount: 18 + index * 7,
    mood: mood.id,
    tracks: buildTrackTitles(mood, index).map((title, trackIndex) => ({
      id: `${mood.id}-${index + 1}-${trackIndex + 1}`,
      title,
      artist: "Local Demo Mix"
    }))
  }));

  return {
    success: true,
    mood: mood.id,
    query: mood.keywords[0] ?? mood.name,
    source: "fallback",
    playlists,
    meta: {
      cached: false,
      fallbackUsed: true,
      generatedAt: new Date().toISOString(),
      message
    },
    usingLocalFallback: true,
    message
  };
}

async function requestPlaylists(path: "/api/playlists/generate" | "/api/playlists/regenerate", mood: Mood, limit: number) {
  const response = await apiClient.post<PlaylistGenerationResponse>(
    path,
    {
      mood: mood.id,
      source: "spotify",
      limit
    },
    { timeout: 8000 }
  );

  return response.data;
}

export async function generatePlaylists(mood: Mood, limit = 8): Promise<PlaylistCatalogResult> {
  try {
    return await requestPlaylists("/api/playlists/generate", mood, limit);
  } catch (error) {
    const isNetworkIssue = error instanceof AxiosError && !error.response;
    if (isNetworkIssue) {
      return localMockResponse(mood, "Using local playlist data. Backend is not connected.");
    }
    throw error;
  }
}

export async function regeneratePlaylists(mood: Mood, limit = 8): Promise<PlaylistCatalogResult> {
  try {
    return await requestPlaylists("/api/playlists/regenerate", mood, limit);
  } catch (error) {
    const isNetworkIssue = error instanceof AxiosError && !error.response;
    if (isNetworkIssue) {
      return localMockResponse(mood, "Using local playlist data. Backend is not connected.");
    }
    throw error;
  }
}
