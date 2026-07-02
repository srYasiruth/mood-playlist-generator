import type { Request, Response } from "express";
import { formatSuccess } from "../../utils/responseFormatter";
import { getInitialMoods } from "./moods.service";

export function getMoods(_req: Request, res: Response) {
  res.json(formatSuccess("Moods retrieved successfully", getInitialMoods()));
}

