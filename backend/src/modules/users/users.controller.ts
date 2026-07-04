import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { getDashboardStats } from "./users.service";

export async function getDashboardController(req: AuthenticatedRequest, res: Response) {
  try {
    const stats = await getDashboardStats(req.authUser!.userId);
    return res.json({ success: true, stats });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Could not load dashboard stats.",
      errorCode: "SERVER_ERROR"
    });
  }
}