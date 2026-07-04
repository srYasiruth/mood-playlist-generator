import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { getDashboardController } from "./users.controller";

export const usersRouter = Router();

usersRouter.get("/dashboard", requireAuth, getDashboardController);