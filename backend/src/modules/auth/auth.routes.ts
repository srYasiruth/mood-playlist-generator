import { Router } from "express";
import { authPlaceholder } from "./auth.controller";

export const authRouter = Router();

authRouter.all("*", authPlaceholder);

