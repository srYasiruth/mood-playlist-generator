import { prisma } from "../../config/database";
import { env } from "../../config/env";
import {
  searchPlaylists,
  SpotifyApiError,
  SpotifyConfigurationError
} from "../../integrations/spotify.service";
import { logger } from "../../utils/logger";
import { getMoodDefinition, selectMoodQuery } from "../../utils/moodMapping";
import {
  PlaylistApiError,
  type PlaylistGenerationRequest,
  type PlaylistGenerationResponse,
  type PlaylistItem
} from "./playlists.types";

type CacheEntry = {
  expiresAt: number;
  response: PlaylistGenerationResponse;
};

const playlistCache = new Map<string, CacheEntry>();
const lastQueryByMood = new Map<string, string>();

function cacheKey(source: string, mood: string, query: string, limit: number) {
  return `${source}:${mood}:${query}:${limit}`;
}

function getCachedResponse(key: string) {
  const cached = playlistCache.get(key);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt < Date.now()) {
    playlistCache.delete(key);
    return null;
  }

  return {
    ...cached.response,
    meta: {
      ...cached.response.meta,
      cached: true,
      generatedAt: new Date().toISOString()
    }
  };
}

function setCachedResponse(key: string, response: PlaylistGenerationResponse) {
  playlistCache.set(key, {
    expiresAt: Date.now() + env.PLAYLIST_CACHE_TTL_SECONDS * 1000,
    response
  });
}

function createFallbackPlaylists(moodId: string, query: string, limit: number): PlaylistItem[] {
  const mood = getMoodDefinition(moodId);
  if (!mood) {
    return [];
  }

  return Array.from({ length: Math.min(limit, 8) }, (_, index) => {
    const genre = mood.genres[index % mood.genres.length] ?? "mixed";
    const label = ["Starter Mix", "Deep Cut Set", "Daily Lift", "Evening Flow", "Focus Lane", "Fresh Finds", "Pulse Check", "Quiet Room"][index];

    return {
      id: `fallback-${mood.id}-${index + 1}`,
      title: `${mood.name} ${label}`,
      description: `${mood.description} Demo playlist based on ${query} and ${genre} cues.`,
      imageUrl: mood.fallbackImage,
      externalUrl: `https://open.spotify.com/search/${encodeURIComponent(query)}`,
      trackCount: 20 + index * 5,
      source: "fallback",
      mood: mood.id
    };
  });
}

function buildResponse(params: {
  mood: string;
  query: string;
  source: string;
  playlists: PlaylistItem[];
  cached?: boolean;
  fallbackUsed: boolean;
  message?: string;
}): PlaylistGenerationResponse {
  return {
    success: true,
    mood: params.mood,
    query: params.query,
    source: params.source,
    playlists: params.playlists,
    meta: {
      cached: params.cached ?? false,
      fallbackUsed: params.fallbackUsed,
      generatedAt: new Date().toISOString(),
      ...(params.message ? { message: params.message } : {})
    }
  };
}

async function generateFallbackResponse(request: PlaylistGenerationRequest, query: string, message?: string) {
  const playlists = createFallbackPlaylists(request.mood, query, request.limit);

  if (playlists.length === 0) {
    throw new PlaylistApiError("No fallback playlists were found.", "NOT_FOUND", 404);
  }

  return buildResponse({
    mood: request.mood,
    query,
    source: "fallback",
    playlists,
    fallbackUsed: true,
    message
  });
}

export async function generatePlaylists(request: PlaylistGenerationRequest, options?: { regenerate?: boolean }) {
  const mood = getMoodDefinition(request.mood);
  if (!mood) {
    throw new PlaylistApiError("Invalid mood selected.", "INVALID_MOOD", 400);
  }

  const avoidQuery = options?.regenerate ? lastQueryByMood.get(request.mood) : undefined;
  const query = selectMoodQuery(request.mood, avoidQuery);
  if (!query) {
    throw new PlaylistApiError("Invalid mood selected.", "INVALID_MOOD", 400);
  }
  lastQueryByMood.set(request.mood, query);

  if (request.source === "fallback") {
    return generateFallbackResponse(request, query, "Using demo playlist suggestions.");
  }

  const key = cacheKey(request.source, request.mood, query, request.limit);
  const cached = getCachedResponse(key);
  if (cached) {
    return cached;
  }

  try {
    const playlists = await searchPlaylists(query, request.limit, mood);

    if (playlists.length === 0) {
      logger.warn(`Spotify returned no playlists for mood=${request.mood} query="${query}".`);
      const fallback = await generateFallbackResponse(
        request,
        query,
        "Using demo playlist suggestions because Spotify returned no playlists."
      );
      setCachedResponse(key, fallback);
      return fallback;
    }

    const response = buildResponse({
      mood: request.mood,
      query,
      source: "spotify",
      playlists,
      fallbackUsed: false
    });
    setCachedResponse(key, response);
    return response;
  } catch (error) {
    if (error instanceof SpotifyConfigurationError) {
      logger.warn("Spotify credentials are not configured. Returning demo playlist suggestions.");
      const fallback = await generateFallbackResponse(
        request,
        query,
        "Using demo playlist suggestions. Spotify is not configured yet."
      );
      setCachedResponse(key, fallback);
      return fallback;
    }

    if (error instanceof SpotifyApiError && error.statusCode === 429) {
      logger.warn("Spotify rate limit reached. Returning demo playlist suggestions.");
      const fallback = await generateFallbackResponse(
        request,
        query,
        "Using demo playlist suggestions while Spotify rate limits recover."
      );
      setCachedResponse(key, fallback);
      return fallback;
    }

    logger.error(error instanceof Error ? error.message : "Spotify playlist generation failed.");
    const fallback = await generateFallbackResponse(
      request,
      query,
      "Using demo playlist suggestions while Spotify is unavailable."
    );
    setCachedResponse(key, fallback);
    return fallback;
  }
}

export async function savePlaylistHistory(userId: string, response: PlaylistGenerationResponse) {
  return prisma.playlistHistory.create({
    data: {
      userId,
      mood: response.mood,
      inputType: "manual",
      journalTextSaved: false,
      searchQuery: response.query,
      apiSource: response.source,
      resultData: response
    }
  });
}

export async function getPlaylistHistory(userId: string, page = 1, limit = 10) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(50, Math.max(1, limit));
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await Promise.all([
    prisma.playlistHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: safeLimit
    }),
    prisma.playlistHistory.count({ where: { userId } })
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.max(1, Math.ceil(total / safeLimit))
    }
  };
}

export async function deletePlaylistHistoryItem(userId: string, historyId: string) {
  const item = await prisma.playlistHistory.findUnique({ where: { id: historyId } });
  if (!item || item.userId !== userId) {
    throw new PlaylistApiError("Playlist history item not found.", "NOT_FOUND", 404);
  }

  await prisma.playlistHistory.delete({ where: { id: historyId } });
}

export async function clearPlaylistHistory(userId: string) {
  await prisma.playlistHistory.deleteMany({ where: { userId } });
}
