import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { loginController, logoutController, meController, registerController } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", requireAuth, meController);
authRouter.post("/logout", logoutController);
