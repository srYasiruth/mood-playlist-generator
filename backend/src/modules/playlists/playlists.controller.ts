import type { Request, Response } from "express";

export function playlistsPlaceholder(_req: Request, res: Response) {
  res.status(501).json({
    success: false,
    message: "Playlist generation will be implemented in a future phase"
  });
}

