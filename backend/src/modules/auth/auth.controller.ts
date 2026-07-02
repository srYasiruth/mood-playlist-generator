import type { Request, Response } from "express";

export function authPlaceholder(_req: Request, res: Response) {
  res.status(501).json({
    success: false,
    message: "Authentication will be implemented in a future phase"
  });
}

