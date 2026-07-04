import { prisma } from "../../config/database";
import { detectMoodFromText } from "../../utils/moodDetector";
import { getMoodDefinition } from "../../utils/moodMapping";
import { initialMoods } from "./moods.data";

export class MoodError extends Error {
  statusCode: number;
  errorCode: "INVALID_INPUT" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "SERVER_ERROR";

  constructor(message: string, errorCode: MoodError["errorCode"], statusCode = 400) {
    super(message);
    this.name = "MoodError";
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

export function getInitialMoods() {
  return initialMoods;
}

async function ensureMoodByKey(moodKey: string) {
  const definition = getMoodDefinition(moodKey);
  if (!definition) {
    throw new MoodError("Invalid mood selected.", "INVALID_INPUT", 400);
  }

  return prisma.mood.upsert({
    where: { key: definition.id },
    update: {
      name: definition.name,
      description: definition.description,
      keywords: definition.queries,
      genres: definition.genres,
      theme: {
        energy: definition.energy,
        fallbackImage: definition.fallbackImage
      }
    },
    create: {
      key: definition.id,
      name: definition.name,
      description: definition.description,
      keywords: definition.queries,
      genres: definition.genres,
      theme: {
        energy: definition.energy,
        fallbackImage: definition.fallbackImage
      }
    }
  });
}

export async function detectJournalMood(text: string) {
  const result = detectMoodFromText(text);
  const moodDefinition = getMoodDefinition(result.detectedMood);
  const mood = await ensureMoodByKey(result.detectedMood);

  return {
    ...result,
    mood: {
      id: mood.id,
      name: mood.name,
      slug: mood.key,
      description: mood.description ?? moodDefinition?.description ?? ""
    }
  };
}

export async function addFavoriteMood(userId: string, moodKey: string) {
  const mood = await ensureMoodByKey(moodKey.toLowerCase());

  return prisma.favoriteMood.upsert({
    where: {
      userId_moodId: {
        userId,
        moodId: mood.id
      }
    },
    update: {},
    create: {
      userId,
      moodId: mood.id
    },
    include: { mood: true }
  });
}

export function getFavoriteMoods(userId: string) {
  return prisma.favoriteMood.findMany({
    where: { userId },
    include: { mood: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function removeFavoriteMood(userId: string, favoriteId: string) {
  const favorite = await prisma.favoriteMood.findUnique({ where: { id: favoriteId } });
  if (!favorite || favorite.userId !== userId) {
    throw new MoodError("Favorite mood not found.", "NOT_FOUND", 404);
  }

  await prisma.favoriteMood.delete({ where: { id: favoriteId } });
}