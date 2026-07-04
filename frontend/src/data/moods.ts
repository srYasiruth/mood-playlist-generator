import type { Mood, MoodTheme } from "../types/mood";

export const defaultTheme: MoodTheme = {
  background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 42%, #fdf2f8 100%)",
  surface: "rgba(255, 255, 255, 0.82)",
  accent: "#0f172a",
  accentSoft: "#e2e8f0",
  text: "#0f172a",
  muted: "#475569",
  border: "rgba(148, 163, 184, 0.32)",
  ring: "rgba(15, 23, 42, 0.22)",
  coverGradient: "linear-gradient(135deg, #0f172a, #38bdf8)"
};

export const localMoods: Mood[] = [
  {
    id: "happy",
    name: "Happy",
    description: "Bright songs for a lifted, sunny mood.",
    emoji: "☀️",
    keywords: ["feel good", "upbeat", "sunny", "pop"],
    genres: ["Pop", "Dance", "Indie Pop"],
    theme: {
      background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 42%, #fde68a 100%)",
      surface: "rgba(255, 251, 235, 0.86)",
      accent: "#c2410c",
      accentSoft: "#fed7aa",
      text: "#431407",
      muted: "#7c2d12",
      border: "rgba(251, 146, 60, 0.34)",
      ring: "rgba(249, 115, 22, 0.32)",
      coverGradient: "linear-gradient(135deg, #f97316, #facc15)"
    }
  },
  {
    id: "sad",
    name: "Sad",
    description: "Gentle tracks for feeling, reflecting, and breathing.",
    emoji: "🌧️",
    keywords: ["melancholy", "soft", "emotional", "acoustic"],
    genres: ["Acoustic", "Indie", "Piano"],
    theme: {
      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 48%, #ede9fe 100%)",
      surface: "rgba(239, 246, 255, 0.86)",
      accent: "#3730a3",
      accentSoft: "#c7d2fe",
      text: "#172554",
      muted: "#334155",
      border: "rgba(99, 102, 241, 0.28)",
      ring: "rgba(79, 70, 229, 0.24)",
      coverGradient: "linear-gradient(135deg, #2563eb, #7c3aed)"
    }
  },
  {
    id: "relaxed",
    name: "Relaxed",
    description: "Soft grooves and calm textures for slowing down.",
    emoji: "🌿",
    keywords: ["calm", "chill", "ambient", "easy"],
    genres: ["Lo-fi", "Ambient", "Soul"],
    theme: {
      background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 44%, #bfdbfe 100%)",
      surface: "rgba(240, 253, 244, 0.86)",
      accent: "#047857",
      accentSoft: "#a7f3d0",
      text: "#052e16",
      muted: "#14532d",
      border: "rgba(16, 185, 129, 0.28)",
      ring: "rgba(5, 150, 105, 0.24)",
      coverGradient: "linear-gradient(135deg, #10b981, #38bdf8)"
    }
  },
  {
    id: "focused",
    name: "Focused",
    description: "Clean, steady music for deep work and study.",
    emoji: "🎧",
    keywords: ["focus", "study", "instrumental", "deep work"],
    genres: ["Instrumental", "Electronic", "Classical"],
    theme: {
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 45%, #cbd5e1 100%)",
      surface: "rgba(248, 250, 252, 0.88)",
      accent: "#1e3a8a",
      accentSoft: "#bfdbfe",
      text: "#0f172a",
      muted: "#334155",
      border: "rgba(71, 85, 105, 0.24)",
      ring: "rgba(30, 58, 138, 0.22)",
      coverGradient: "linear-gradient(135deg, #0f172a, #2563eb)"
    }
  },
  {
    id: "angry",
    name: "Angry",
    description: "High-pressure tracks for letting the heat move through.",
    emoji: "🔥",
    keywords: ["intense", "rock", "metal", "release"],
    genres: ["Rock", "Hip-Hop", "Alternative"],
    theme: {
      background: "linear-gradient(135deg, #1f0303 0%, #7f1d1d 52%, #18181b 100%)",
      surface: "rgba(255, 241, 242, 0.9)",
      accent: "#b91c1c",
      accentSoft: "#fecaca",
      text: "#1f0303",
      muted: "#7f1d1d",
      border: "rgba(248, 113, 113, 0.36)",
      ring: "rgba(239, 68, 68, 0.3)",
      coverGradient: "linear-gradient(135deg, #991b1b, #111827)"
    }
  },
  {
    id: "motivated",
    name: "Motivated",
    description: "Momentum-building music for getting moving.",
    emoji: "🚀",
    keywords: ["workout", "confidence", "power", "anthem"],
    genres: ["Hip-Hop", "Pop", "EDM"],
    theme: {
      background: "linear-gradient(135deg, #fff1f2 0%, #fed7aa 45%, #ddd6fe 100%)",
      surface: "rgba(255, 247, 237, 0.86)",
      accent: "#db2777",
      accentSoft: "#fbcfe8",
      text: "#4c0519",
      muted: "#9d174d",
      border: "rgba(236, 72, 153, 0.28)",
      ring: "rgba(219, 39, 119, 0.24)",
      coverGradient: "linear-gradient(135deg, #f43f5e, #8b5cf6)"
    }
  },
  {
    id: "romantic",
    name: "Romantic",
    description: "Warm, intimate songs for soft-hearted moments.",
    emoji: "💗",
    keywords: ["love", "warm", "r&b", "slow"],
    genres: ["R&B", "Soul", "Pop"],
    theme: {
      background: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 45%, #fbcfe8 100%)",
      surface: "rgba(255, 241, 242, 0.88)",
      accent: "#be123c",
      accentSoft: "#fecdd3",
      text: "#4c0519",
      muted: "#9f1239",
      border: "rgba(244, 63, 94, 0.26)",
      ring: "rgba(225, 29, 72, 0.22)",
      coverGradient: "linear-gradient(135deg, #e11d48, #f9a8d4)"
    }
  },
  {
    id: "energetic",
    name: "Energetic",
    description: "Fast, bright tracks for movement and charge.",
    emoji: "⚡",
    keywords: ["dance", "party", "fast", "electronic"],
    genres: ["EDM", "Dance", "Pop"],
    theme: {
      background: "linear-gradient(135deg, #fefce8 0%, #ffedd5 44%, #cffafe 100%)",
      surface: "rgba(255, 251, 235, 0.86)",
      accent: "#ea580c",
      accentSoft: "#fed7aa",
      text: "#431407",
      muted: "#9a3412",
      border: "rgba(251, 146, 60, 0.3)",
      ring: "rgba(234, 88, 12, 0.24)",
      coverGradient: "linear-gradient(135deg, #f97316, #06b6d4)"
    }
  },
  {
    id: "stressed",
    name: "Stressed",
    description: "Grounding music for easing pressure and tension.",
    emoji: "🫧",
    keywords: ["calming", "breath", "ambient", "unwind"],
    genres: ["Ambient", "Lo-fi", "Neo-classical"],
    theme: {
      background: "linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 45%, #dbeafe 100%)",
      surface: "rgba(245, 243, 255, 0.88)",
      accent: "#6d28d9",
      accentSoft: "#ddd6fe",
      text: "#2e1065",
      muted: "#5b21b6",
      border: "rgba(124, 58, 237, 0.24)",
      ring: "rgba(109, 40, 217, 0.2)",
      coverGradient: "linear-gradient(135deg, #7c3aed, #60a5fa)"
    }
  },
  {
    id: "sleepy",
    name: "Sleepy",
    description: "Night-soft sounds for winding down.",
    emoji: "🌙",
    keywords: ["sleep", "night", "soft", "dreamy"],
    genres: ["Ambient", "Piano", "Dream Pop"],
    theme: {
      background: "linear-gradient(135deg, #111827 0%, #312e81 50%, #c4b5fd 100%)",
      surface: "rgba(238, 242, 255, 0.9)",
      accent: "#4f46e5",
      accentSoft: "#c7d2fe",
      text: "#111827",
      muted: "#4338ca",
      border: "rgba(129, 140, 248, 0.3)",
      ring: "rgba(99, 102, 241, 0.24)",
      coverGradient: "linear-gradient(135deg, #111827, #818cf8)"
    }
  }
];

export function findMoodById(id?: string | null) {
  return localMoods.find((mood) => mood.id === id);
}

export function enrichMood(apiMood: Partial<Mood>): Mood {
  const localMatch =
    findMoodById(apiMood.id) ??
    localMoods.find((mood) => mood.name.toLowerCase() === apiMood.name?.toLowerCase());

  if (localMatch) {
    return { ...localMatch, ...apiMood, theme: apiMood.theme ?? localMatch.theme };
  }

  return {
    id: apiMood.id ?? apiMood.name?.toLowerCase() ?? "unknown",
    name: apiMood.name ?? "Unknown mood",
    description: apiMood.description ?? "A custom mood for future playlist recommendations.",
    emoji: apiMood.emoji ?? "🎵",
    keywords: apiMood.keywords ?? ["music"],
    genres: apiMood.genres ?? ["Mixed"],
    theme: apiMood.theme ?? defaultTheme
  };
}
