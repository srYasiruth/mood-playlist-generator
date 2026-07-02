import type { Request, Response } from "express";

export function sharingPlaceholder(_req: Request, res: Response) {
  res.status(501).json({
    success: false,
    message: "Playlist sharing will be implemented in a future phase"
  });
}

