import { apiClient } from "./apiClient";
import type { Mood } from "../types/mood";

type MoodResponse = {
  success: boolean;
  message: string;
  data: Mood[];
};

export async function getMoods() {
  const response = await apiClient.get<MoodResponse>("/api/moods");
  return response.data;
}

