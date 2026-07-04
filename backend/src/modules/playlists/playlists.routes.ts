import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middleware/auth.middleware";
import { playlistRateLimiter } from "../../middleware/rateLimit.middleware";
import {
  clearPlaylistHistoryController,
  deletePlaylistHistoryItemController,
  generatePlaylistsController,
  getPlaylistHistoryController,
  regeneratePlaylistsController
} from "./playlists.controller";

export const playlistsRouter = Router();

playlistsRouter.post("/generate", playlistRateLimiter, optionalAuth, generatePlaylistsController);
playlistsRouter.post("/regenerate", playlistRateLimiter, optionalAuth, regeneratePlaylistsController);
playlistsRouter.get("/history", requireAuth, getPlaylistHistoryController);
playlistsRouter.delete("/history", requireAuth, clearPlaylistHistoryController);
playlistsRouter.delete("/history/:id", requireAuth, deletePlaylistHistoryItemController);
