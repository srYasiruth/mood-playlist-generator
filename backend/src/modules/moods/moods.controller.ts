import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { formatSuccess } from "../../utils/responseFormatter";
import {
  addFavoriteMood,
  detectJournalMood,
  getFavoriteMoods,
  getInitialMoods,
  MoodError,
  removeFavoriteMood
} from "./moods.service";
import { validateMoodDetectionRequest } from "./moods.validation";

function sendMoodError(res: Response, error: unknown) {
  if (error instanceof MoodError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode
    });
  }

  return res.status(500).json({
    success: false,
    message: "Mood request failed.",
    errorCode: "SERVER_ERROR"
  });
}

export function getMoods(_req: Request, res: Response) {
  res.json(formatSuccess("Moods retrieved successfully", getInitialMoods()));
}

export async function detectMoodController(req: Request, res: Response) {
  try {
    const { text } = validateMoodDetectionRequest(req.body);
    const result = await detectJournalMood(text);
    return res.json({ success: true, ...result });
  } catch (error) {
    return sendMoodError(res, error);
  }
}

export async function addFavoriteMoodController(req: AuthenticatedRequest, res: Response) {
  try {
    const moodKey = typeof req.body?.mood === "string" ? req.body.mood : req.body?.moodKey;
    if (!moodKey || typeof moodKey !== "string") {
      return res.status(400).json({
        success: false,
        message: "Mood is required.",
        errorCode: "INVALID_INPUT"
      });
    }

    const favorite = await addFavoriteMood(req.authUser!.userId, moodKey);
    return res.status(201).json({
      success: true,
      message: "Favorite mood saved.",
      favorite
    });
  } catch (error) {
    return sendMoodError(res, error);
  }
}

export async function getFavoriteMoodsController(req: AuthenticatedRequest, res: Response) {
  try {
    const favorites = await getFavoriteMoods(req.authUser!.userId);
    return res.json({ success: true, favorites });
  } catch (error) {
    return sendMoodError(res, error);
  }
}

export async function removeFavoriteMoodController(req: AuthenticatedRequest, res: Response) {
  try {
    await removeFavoriteMood(req.authUser!.userId, req.params.id);
    return res.json({
      success: true,
      message: "Favorite mood removed."
    });
  } catch (error) {
    return sendMoodError(res, error);
  }
}