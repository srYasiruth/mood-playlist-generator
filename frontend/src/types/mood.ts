export type MoodTheme = {
  background: string;
  surface: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
  border: string;
  ring: string;
  coverGradient: string;
};

export type Mood = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  keywords: string[];
  genres: string[];
  theme: MoodTheme;
};

export type DetectMoodRequest = {
  text: string;
};

export type DetectedMood = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type DetectMoodResponse = {
  success: true;
  detectedMood: string;
  mood?: DetectedMood;
  confidence: number;
  reason: string;
  matchedSignals: string[];
};