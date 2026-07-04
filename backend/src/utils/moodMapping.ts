export type MoodEnergy = "low" | "medium" | "high";

export type MoodDefinition = {
  id: string;
  name: string;
  description: string;
  queries: string[];
  genres: string[];
  energy: MoodEnergy;
  fallbackImage: string;
};

function svgImage(label: string, start: string, end: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${start}"/><stop offset="1" stop-color="${end}"/></linearGradient></defs><rect width="640" height="640" rx="48" fill="url(#g)"/><circle cx="500" cy="140" r="90" fill="rgba(255,255,255,.18)"/><circle cx="128" cy="520" r="130" fill="rgba(255,255,255,.12)"/><text x="56" y="356" fill="white" font-family="Arial, sans-serif" font-size="58" font-weight="700">${label}</text><text x="60" y="424" fill="rgba(255,255,255,.78)" font-family="Arial, sans-serif" font-size="28">Mood Playlist</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const moodDefinitions: Record<string, MoodDefinition> = {
  happy: {
    id: "happy",
    name: "Happy",
    description: "Bright songs for a lifted, sunny mood.",
    queries: ["happy hits", "feel good music", "upbeat pop", "sunny dance playlist"],
    genres: ["pop", "dance", "indie pop"],
    energy: "high",
    fallbackImage: svgImage("Happy", "#f97316", "#facc15")
  },
  sad: {
    id: "sad",
    name: "Sad",
    description: "Gentle tracks for feeling, reflecting, and breathing.",
    queries: ["sad acoustic", "melancholy indie", "emotional piano", "soft rainy day songs"],
    genres: ["acoustic", "indie", "piano"],
    energy: "low",
    fallbackImage: svgImage("Sad", "#2563eb", "#7c3aed")
  },
  relaxed: {
    id: "relaxed",
    name: "Relaxed",
    description: "Soft grooves and calm textures for slowing down.",
    queries: ["chill vibes", "relaxing lofi", "calm soul", "peaceful ambient"],
    genres: ["lofi", "ambient", "soul"],
    energy: "low",
    fallbackImage: svgImage("Relaxed", "#10b981", "#38bdf8")
  },
  focused: {
    id: "focused",
    name: "Focused",
    description: "Clean, steady music for deep work and study.",
    queries: ["lofi study", "deep focus", "instrumental work", "coding concentration"],
    genres: ["lofi", "ambient", "instrumental"],
    energy: "medium",
    fallbackImage: svgImage("Focused", "#0f172a", "#2563eb")
  },
  angry: {
    id: "angry",
    name: "Angry",
    description: "High-pressure tracks for letting the heat move through.",
    queries: ["angry rock", "rage workout", "heavy alternative", "intense hip hop"],
    genres: ["rock", "metal", "hip hop"],
    energy: "high",
    fallbackImage: svgImage("Angry", "#991b1b", "#111827")
  },
  motivated: {
    id: "motivated",
    name: "Motivated",
    description: "Momentum-building music for getting moving.",
    queries: ["motivational workout", "confidence boost", "power anthems", "run faster music"],
    genres: ["hip hop", "pop", "edm"],
    energy: "high",
    fallbackImage: svgImage("Motivated", "#f43f5e", "#8b5cf6")
  },
  romantic: {
    id: "romantic",
    name: "Romantic",
    description: "Warm, intimate songs for soft-hearted moments.",
    queries: ["romantic r&b", "love songs", "slow soul", "warm date night"],
    genres: ["r&b", "soul", "pop"],
    energy: "medium",
    fallbackImage: svgImage("Romantic", "#e11d48", "#f9a8d4")
  },
  energetic: {
    id: "energetic",
    name: "Energetic",
    description: "Fast, bright tracks for movement and charge.",
    queries: ["energetic dance", "party hits", "electronic workout", "high energy pop"],
    genres: ["edm", "dance", "pop"],
    energy: "high",
    fallbackImage: svgImage("Energetic", "#f97316", "#06b6d4")
  },
  stressed: {
    id: "stressed",
    name: "Stressed",
    description: "Grounding music for easing pressure and tension.",
    queries: ["calming ambient", "stress relief music", "breathing meditation", "peaceful lofi"],
    genres: ["ambient", "lofi", "neo classical"],
    energy: "low",
    fallbackImage: svgImage("Stressed", "#7c3aed", "#60a5fa")
  },
  sleepy: {
    id: "sleepy",
    name: "Sleepy",
    description: "Night-soft sounds for winding down.",
    queries: ["sleep music", "dreamy ambient", "soft piano sleep", "night chill"],
    genres: ["ambient", "piano", "dream pop"],
    energy: "low",
    fallbackImage: svgImage("Sleepy", "#111827", "#818cf8")
  }
};

export const supportedMoodIds = Object.keys(moodDefinitions);

export function getMoodDefinition(moodId: string) {
  return moodDefinitions[moodId.toLowerCase()];
}

export function selectMoodQuery(moodId: string, avoidQuery?: string) {
  const mood = getMoodDefinition(moodId);
  if (!mood) {
    return null;
  }

  const availableQueries = avoidQuery
    ? mood.queries.filter((query) => query !== avoidQuery)
    : mood.queries;
  const queryPool = availableQueries.length > 0 ? availableQueries : mood.queries;
  return queryPool[Math.floor(Math.random() * queryPool.length)];
}
