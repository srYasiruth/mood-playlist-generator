import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { defaultTheme, findMoodById } from "../data/moods";
import type { Mood, MoodTheme } from "../types/mood";

type MoodThemeContextValue = {
  selectedMood: Mood | null;
  setSelectedMood: (mood: Mood | null) => void;
  theme: MoodTheme;
};

const MoodThemeContext = createContext<MoodThemeContextValue | undefined>(undefined);

type MoodThemeProviderProps = {
  children: ReactNode;
};

export function MoodThemeProvider({ children }: MoodThemeProviderProps) {
  const [selectedMood, setSelectedMoodState] = useState<Mood | null>(() => {
    const storedMoodId = window.localStorage.getItem("selectedMoodId");
    return findMoodById(storedMoodId) ?? null;
  });

  const setSelectedMood = (mood: Mood | null) => {
    setSelectedMoodState(mood);
    if (mood) {
      window.localStorage.setItem("selectedMoodId", mood.id);
    } else {
      window.localStorage.removeItem("selectedMoodId");
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--mood-accent",
      selectedMood?.theme.accent ?? defaultTheme.accent
    );
  }, [selectedMood]);

  const value = useMemo(
    () => ({
      selectedMood,
      setSelectedMood,
      theme: selectedMood?.theme ?? defaultTheme
    }),
    [selectedMood]
  );

  return <MoodThemeContext.Provider value={value}>{children}</MoodThemeContext.Provider>;
}

export function useMoodTheme() {
  const context = useContext(MoodThemeContext);

  if (!context) {
    throw new Error("useMoodTheme must be used inside MoodThemeProvider");
  }

  return context;
}
