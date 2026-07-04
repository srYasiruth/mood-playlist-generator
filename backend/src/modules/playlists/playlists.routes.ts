import { Router } from "express";
import { playlistRateLimiter } from "../../middleware/rateLimit.middleware";
import { generatePlaylistsController, regeneratePlaylistsController } from "./playlists.controller";

export const playlistsRouter = Router();

playlistsRouter.post("/generate", playlistRateLimiter, generatePlaylistsController);
playlistsRouter.post("/regenerate", playlistRateLimiter, regeneratePlaylistsController);
