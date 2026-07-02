import { Router } from "express";
import { sharingPlaceholder } from "./sharing.controller";

export const sharingRouter = Router();

sharingRouter.all("*", sharingPlaceholder);

