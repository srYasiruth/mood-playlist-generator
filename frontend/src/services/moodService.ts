import { AxiosError } from "axios";
import { enrichMood, localMoods } from "../data/moods";
import type { Mood } from "../types/mood";
import { apiClient } from "./apiClient";

type BackendMood = Partial<Mood> & {
  id: string;
  name: string;
};

type MoodResponse = {
  success: boolean;
  message: string;
  data: BackendMood[];
};

export type MoodCatalogResult = {
  moods: Mood[];
  usingFallback: boolean;
  message?: string;
};

export async function getMoodCatalog(): Promise<MoodCatalogResult> {
  try {
    const response = await apiClient.get<MoodResponse>("/api/moods", { timeout: 3500 });
    return {
      moods: response.data.data.map(enrichMood),
      usingFallback: false
    };
  } catch (error) {
    const isNetworkIssue = error instanceof AxiosError && !error.response;

    return {
      moods: localMoods,
      usingFallback: true,
      message: isNetworkIssue
        ? "Using local mood data. Backend is not connected."
        : "Using local mood data while the backend response is unavailable."
    };
  }
}
