import { Router } from "express";
import { getMoods } from "./moods.controller";

export const moodsRouter = Router();

moodsRouter.get("/", getMoods);

