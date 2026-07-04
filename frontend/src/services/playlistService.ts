import type { Mood } from "../types/mood";
import type { Playlist } from "../types/playlist";

const playlistMoods = [
  "First Spark",
  "Deep Current",
  "Late Night Signal",
  "Open Window"
];

const providerCycle: Playlist["provider"][] = ["Spotify", "Spotify", "YouTube", "Mock"];

function buildTrackTitles(mood: Mood, playlistIndex: number) {
  const keyword = mood.keywords[playlistIndex % mood.keywords.length] ?? mood.name;
  return [
    `${mood.name} ${playlistIndex + 1}`,
    `${keyword} pulse`,
    `${mood.genres[0] ?? "mixed"} drift`
  ];
}

export async function generateMockPlaylists(mood: Mood): Promise<Playlist[]> {
  await new Promise((resolve) => window.setTimeout(resolve, 900));

  return playlistMoods.map((label, index) => ({
    id: `${mood.id}-${index + 1}`,
    title: `${mood.name} ${label}`,
    description: `A ${mood.description.toLowerCase()} Built from ${mood.keywords
      .slice(0, 3)
      .join(", ")} mood cues.`,
    provider: providerCycle[index],
    externalUrl: "#",
    coverGradient: mood.theme.coverGradient,
    trackCount: 18 + index * 7,
    moodTag: mood.name,
    tracks: buildTrackTitles(mood, index).map((title, trackIndex) => ({
      id: `${mood.id}-${index + 1}-${trackIndex + 1}`,
      title,
      artist: "Mock Mix Studio"
    }))
  }));
}
