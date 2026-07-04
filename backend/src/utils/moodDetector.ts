import { getMoodDefinition, supportedMoodIds } from "./moodMapping";

export type DetectedMoodResult = {
  detectedMood: string;
  confidence: number;
  reason: string;
  matchedSignals: string[];
};

type MoodSignalSet = {
  words: string[];
  phrases: string[];
  reason: string;
};

const moodSignals: Record<string, MoodSignalSet> = {
  happy: {
    words: ["happy", "excited", "amazing", "great", "joyful", "smile", "fun", "cheerful", "wonderful", "awesome", "blessed", "good"],
    phrases: ["good mood", "feel good", "so good", "really good"],
    reason: "Your text includes bright, positive, and feel-good words."
  },
  sad: {
    words: ["sad", "lonely", "hurt", "crying", "depressed", "broken", "heartbreak", "empty", "hopeless", "down", "upset", "miserable"],
    phrases: ["feel down", "so alone", "very lonely", "heart broken"],
    reason: "Your text includes sadness, loneliness, or hurt-related words."
  },
  relaxed: {
    words: ["calm", "peaceful", "relaxed", "chill", "quiet", "soft", "rest", "breathe", "nature", "slow", "comfort", "easy"],
    phrases: ["peaceful evening", "quiet rest", "calm evening", "take it easy"],
    reason: "Your text includes calm, peaceful, and rest-related words."
  },
  focused: {
    words: ["study", "studying", "exam", "deadline", "deadlines", "work", "project", "assignment", "concentrate", "focus", "coding", "productive"],
    phrases: ["deep work", "need to study", "finish my project", "get work done"],
    reason: "Your text includes study, work, or concentration-related words."
  },
  angry: {
    words: ["angry", "mad", "frustrated", "annoyed", "hate", "irritated", "furious", "rage", "unfair", "pissed", "argument"],
    phrases: ["so angry", "really mad", "not fair", "unfair situation"],
    reason: "Your text includes anger, frustration, or unfairness-related words."
  },
  motivated: {
    words: ["motivated", "goal", "goals", "grind", "success", "improve", "discipline", "gym", "workout", "push", "confidence", "achieve", "ambition"],
    phrases: ["push myself", "achieve my goals", "work out", "get better"],
    reason: "Your text includes goals, effort, and self-improvement signals."
  },
  romantic: {
    words: ["love", "romantic", "date", "crush", "relationship", "heart", "sweetheart", "affection", "couple", "together"],
    phrases: ["missing you", "miss my love", "love songs", "date night"],
    reason: "Your text includes love, affection, or relationship-related words."
  },
  energetic: {
    words: ["energetic", "energy", "party", "dance", "hype", "pumped", "excited", "run", "fast", "active", "celebration", "festival"],
    phrases: ["ready to dance", "high energy", "feel pumped", "dance party"],
    reason: "Your text includes movement, hype, and high-energy words."
  },
  stressed: {
    words: ["stressed", "stress", "anxious", "anxiety", "overwhelmed", "pressure", "panic", "worried", "tension", "deadlines", "deadline"],
    phrases: ["too much", "burned out", "burnt out", "under pressure", "so stressed"],
    reason: "Your text includes stress, pressure, or anxiety-related words."
  },
  sleepy: {
    words: ["sleepy", "sleep", "tired", "exhausted", "night", "bed", "rest", "insomnia", "drowsy", "nap", "dream"],
    phrases: ["can't sleep", "cant sleep", "cannot sleep", "go to bed", "need sleep"],
    reason: "Your text includes tiredness, sleep, or night-related words."
  }
};

const stressContext = new Set(["deadline", "deadlines", "exam", "work", "project", "assignment", "studying", "study"]);
const stressWords = new Set(["stress", "stressed", "anxious", "anxiety", "overwhelmed", "pressure", "panic", "worried", "tension"]);
const sleepContext = new Set(["sleep", "sleepy", "night", "bed", "insomnia", "drowsy", "nap", "dream"]);
const tiredWords = new Set(["tired", "exhausted"]);
const sadContext = new Set(["sad", "lonely", "hurt", "crying", "depressed", "broken", "heartbreak", "empty", "hopeless"]);
const relaxedContext = new Set(["calm", "peaceful", "relaxed", "quiet", "rest", "breathe", "comfort"]);

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hasAny(tokens: Set<string>, values: Set<string>) {
  for (const value of values) {
    if (tokens.has(value)) {
      return true;
    }
  }
  return false;
}

function uniqueSignals(signals: string[]) {
  return Array.from(new Set(signals)).slice(0, 8);
}

export function sanitizeJournalText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function containsHtml(text: string) {
  return /<[^>]+>/.test(text);
}

export function detectMoodFromText(text: string): DetectedMoodResult {
  const normalized = normalizeText(text);
  const tokens = normalized ? normalized.split(" ").filter(Boolean) : [];
  const tokenSet = new Set(tokens);
  const scores = new Map<string, number>();
  const matchedByMood = new Map<string, string[]>();

  for (const moodId of supportedMoodIds) {
    scores.set(moodId, 0);
    matchedByMood.set(moodId, []);
  }

  for (const [moodId, signals] of Object.entries(moodSignals)) {
    for (const word of signals.words) {
      if (tokenSet.has(word)) {
        scores.set(moodId, (scores.get(moodId) ?? 0) + 1);
        matchedByMood.get(moodId)?.push(word);
      }
    }

    for (const phrase of signals.phrases) {
      if (normalized.includes(phrase)) {
        scores.set(moodId, (scores.get(moodId) ?? 0) + 2.5);
        matchedByMood.get(moodId)?.push(phrase);
      }
    }
  }

  if (hasAny(tokenSet, stressContext) && hasAny(tokenSet, stressWords)) {
    scores.set("stressed", (scores.get("stressed") ?? 0) + 3);
    matchedByMood.get("stressed")?.push("pressure context");
  }

  if (hasAny(tokenSet, tiredWords) && hasAny(tokenSet, sleepContext)) {
    scores.set("sleepy", (scores.get("sleepy") ?? 0) + 3);
    matchedByMood.get("sleepy")?.push("tired sleep context");
  }

  if (hasAny(tokenSet, tiredWords) && hasAny(tokenSet, sadContext)) {
    scores.set("sad", (scores.get("sad") ?? 0) + 2.5);
    matchedByMood.get("sad")?.push("tired sadness context");
  }

  if (hasAny(tokenSet, relaxedContext)) {
    scores.set("relaxed", (scores.get("relaxed") ?? 0) + 0.75);
  }

  let detectedMood = "relaxed";
  let bestScore = 0;
  const priority = ["stressed", "sleepy", "sad", "focused", "angry", "motivated", "romantic", "energetic", "happy", "relaxed"];

  for (const moodId of priority) {
    const score = scores.get(moodId) ?? 0;
    if (score > bestScore) {
      detectedMood = moodId;
      bestScore = score;
    }
  }

  const sortedScores = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const secondScore = sortedScores.find(([moodId]) => moodId !== detectedMood)?.[1] ?? 0;
  const matchedSignals = uniqueSignals(matchedByMood.get(detectedMood) ?? []);

  if (bestScore <= 0) {
    return {
      detectedMood: "relaxed",
      confidence: 0.38,
      reason: "Your text felt neutral or unclear, so I chose a calm mood as a gentle starting point.",
      matchedSignals: []
    };
  }

  const margin = bestScore - secondScore;
  const confidence = clamp(0.45 + bestScore * 0.13 + margin * 0.06, 0.35, 0.95);
  const mood = getMoodDefinition(detectedMood);
  const baseReason = moodSignals[detectedMood]?.reason ?? `Your text matched ${mood?.name ?? detectedMood} mood signals.`;
  const reason = margin <= 1 && secondScore > 0
    ? `${baseReason} The entry had a few mixed signals, so this is my best match.`
    : baseReason;

  return {
    detectedMood,
    confidence: Number(confidence.toFixed(2)),
    reason,
    matchedSignals
  };
}