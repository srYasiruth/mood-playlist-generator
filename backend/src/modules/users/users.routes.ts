import { Router } from "express";
import { usersPlaceholder } from "./users.controller";

export const usersRouter = Router();

usersRouter.all("*", usersPlaceholder);

