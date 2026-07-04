import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { publicShareRateLimiter, shareCreationRateLimiter } from "../../middleware/rateLimit.middleware";
import { createShareController, disableShareController, getSharedPlaylistController } from "./sharing.controller";

export const sharingRouter = Router();

sharingRouter.post("/", shareCreationRateLimiter, requireAuth, createShareController);
sharingRouter.get("/:shareId", publicShareRateLimiter, getSharedPlaylistController);
sharingRouter.delete("/:shareId", requireAuth, disableShareController);