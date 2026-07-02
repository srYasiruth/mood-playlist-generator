import type { Request, Response } from "express";

export function usersPlaceholder(_req: Request, res: Response) {
  res.status(501).json({
    success: false,
    message: "User features will be implemented in a future phase"
  });
}

