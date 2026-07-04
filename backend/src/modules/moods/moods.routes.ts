import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { moodDetectionRateLimiter } from "../../middleware/rateLimit.middleware";
import {
  addFavoriteMoodController,
  detectMoodController,
  getFavoriteMoodsController,
  getMoods,
  removeFavoriteMoodController
} from "./moods.controller";

export const moodsRouter = Router();

moodsRouter.get("/", getMoods);
moodsRouter.post("/detect", moodDetectionRateLimiter, detectMoodController);
moodsRouter.get("/favorites", requireAuth, getFavoriteMoodsController);
moodsRouter.post("/favorites", requireAuth, addFavoriteMoodController);
moodsRouter.delete("/favorites/:id", requireAuth, removeFavoriteMoodController);