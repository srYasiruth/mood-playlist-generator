import { env, hasSpotifyCredentials } from "../config/env";
import type { PlaylistItem } from "../modules/playlists/playlists.types";
import type { MoodDefinition } from "../utils/moodMapping";

type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type SpotifyImage = {
  url: string;
  height?: number;
  width?: number;
};

type SpotifyPlaylistItem = {
  id?: string;
  name?: string;
  description?: string | null;
  images?: SpotifyImage[];
  external_urls?: {
    spotify?: string;
  };
  tracks?: {
    total?: number;
  };
};

type SpotifySearchResponse = {
  playlists?: {
    items?: Array<SpotifyPlaylistItem | null>;
  };
};

export class SpotifyConfigurationError extends Error {
  constructor() {
    super("Spotify credentials are not configured.");
    this.name = "SpotifyConfigurationError";
  }
}

export class SpotifyApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "SpotifyApiError";
    this.statusCode = statusCode;
  }
}

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

export async function getAccessToken(forceRefresh = false) {
  if (!hasSpotifyCredentials()) {
    throw new SpotifyConfigurationError();
  }

  const now = Date.now();
  if (!forceRefresh && cachedAccessToken && tokenExpiresAt > now + 30_000) {
    return cachedAccessToken;
  }

  const credentials = Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ grant_type: "client_credentials" })
  });

  if (!response.ok) {
    throw new SpotifyApiError("Spotify token request failed.", response.status);
  }

  const data = (await response.json()) as SpotifyTokenResponse;
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedAccessToken;
}

async function spotifyFetch(url: string, retryUnauthorized = true) {
  const token = await getAccessToken(!retryUnauthorized);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401 && retryUnauthorized) {
    cachedAccessToken = null;
    tokenExpiresAt = 0;
    const refreshedToken = await getAccessToken(true);
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${refreshedToken}`
      }
    });
  }

  return response;
}

export function normalizeSpotifyPlaylist(
  item: SpotifyPlaylistItem,
  mood: MoodDefinition
): PlaylistItem | null {
  if (!item.id || !item.name) {
    return null;
  }

  return {
    id: item.id,
    title: item.name,
    description: item.description?.replace(/<[^>]*>/g, "").trim() || mood.description,
    imageUrl: item.images?.[0]?.url ?? mood.fallbackImage,
    externalUrl: item.external_urls?.spotify ?? "https://open.spotify.com/",
    trackCount: item.tracks?.total ?? 0,
    source: "spotify",
    mood: mood.id
  };
}

export async function searchPlaylists(query: string, limit: number, mood: MoodDefinition) {
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "playlist");
  url.searchParams.set("limit", String(limit));

  const response = await spotifyFetch(url.toString());

  if (response.status === 429) {
    throw new SpotifyApiError("Spotify rate limit reached.", 429);
  }

  if (!response.ok) {
    throw new SpotifyApiError("Spotify playlist search failed.", response.status);
  }

  const data = (await response.json()) as SpotifySearchResponse;
  return (data.playlists?.items ?? [])
    .filter((item): item is SpotifyPlaylistItem => Boolean(item))
    .map((item) => normalizeSpotifyPlaylist(item, mood))
    .filter((item): item is PlaylistItem => Boolean(item));
}
