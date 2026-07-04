import { prisma } from "../../config/database";
import { env } from "../../config/env";

type HistorySummary = {
  id: string;
  mood: string;
  inputType: string;
  searchQuery: string | null;
  apiSource: string;
  resultData: unknown;
  createdAt: Date;
};

function playlistCount(resultData: unknown) {
  const data = resultData as { playlists?: unknown[] } | null;
  return Array.isArray(data?.playlists) ? data.playlists.length : 0;
}

function buildShareUrl(shareId: string) {
  return `${env.FRONTEND_URL.replace(/\/$/, "")}/share/${shareId}`;
}

function summarizeHistoryItem(item: HistorySummary) {
  return {
    id: item.id,
    mood: item.mood,
    inputType: item.inputType,
    searchQuery: item.searchQuery,
    apiSource: item.apiSource,
    playlistCount: playlistCount(item.resultData),
    createdAt: item.createdAt.toISOString()
  };
}

export async function getDashboardStats(userId: string) {
  const [history, favoriteMoods, activeShares] = await Promise.all([
    prisma.playlistHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        mood: true,
        inputType: true,
        searchQuery: true,
        apiSource: true,
        resultData: true,
        createdAt: true
      }
    }),
    prisma.favoriteMood.findMany({
      where: { userId },
      include: { mood: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.sharedPlaylist.findMany({
      where: { userId, isActive: true },
      include: {
        playlistHistory: {
          select: {
            mood: true,
            inputType: true,
            searchQuery: true,
            apiSource: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);

  const moodCounter = new Map<string, number>();
  let manualGenerations = 0;
  let textGenerations = 0;

  for (const item of history) {
    moodCounter.set(item.mood, (moodCounter.get(item.mood) ?? 0) + 1);
    if (item.inputType === "text") {
      textGenerations += 1;
    } else {
      manualGenerations += 1;
    }
  }

  const moodCounts = [...moodCounter.entries()]
    .map(([mood, count]) => ({ mood, count }))
    .sort((a, b) => b.count - a.count || a.mood.localeCompare(b.mood));

  return {
    totalPlaylistsGenerated: history.length,
    manualGenerations,
    textGenerations,
    favoriteMoodCount: favoriteMoods.length,
    sharedPlaylistCount: activeShares.length,
    mostSelectedMood: moodCounts[0]?.mood ?? null,
    moodCounts,
    recentHistory: history.slice(0, 5).map(summarizeHistoryItem),
    favoriteMoods: favoriteMoods.slice(0, 8).map((favorite) => ({
      id: favorite.id,
      createdAt: favorite.createdAt.toISOString(),
      mood: {
        id: favorite.mood.id,
        key: favorite.mood.key,
        name: favorite.mood.name,
        description: favorite.mood.description,
        theme: favorite.mood.theme
      }
    })),
    activeShares: activeShares.map((share) => ({
      shareId: share.shareId,
      shareUrl: buildShareUrl(share.shareId),
      mood: share.playlistHistory?.mood ?? "unknown",
      inputType: share.playlistHistory?.inputType ?? "manual",
      source: share.playlistHistory?.apiSource ?? "unknown",
      query: share.playlistHistory?.searchQuery ?? null,
      createdAt: share.createdAt.toISOString()
    }))
  };
}