import type { Request, Response } from "express";
import { generatePlaylists } from "./playlists.service";
import { PlaylistApiError } from "./playlists.types";
import { validatePlaylistRequest } from "./playlists.validation";

function sendPlaylistError(res: Response, error: unknown) {
  if (error instanceof PlaylistApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode
    });
  }

  return res.status(500).json({
    success: false,
    message: "Playlist generation failed.",
    errorCode: "SERVER_ERROR"
  });
}

export async function generatePlaylistsController(req: Request, res: Response) {
  try {
    const request = validatePlaylistRequest(req.body);
    const response = await generatePlaylists(request);
    return res.json(response);
  } catch (error) {
    return sendPlaylistError(res, error);
  }
}

export async function regeneratePlaylistsController(req: Request, res: Response) {
  try {
    const request = validatePlaylistRequest(req.body);
    const response = await generatePlaylists(request, { regenerate: true });
    return res.json(response);
  } catch (error) {
    return sendPlaylistError(res, error);
  }
}
