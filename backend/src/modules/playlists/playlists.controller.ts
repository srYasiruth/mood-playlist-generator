import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { logger } from "../../utils/logger";
import {
  clearPlaylistHistory,
  deletePlaylistHistoryItem,
  generatePlaylists,
  getPlaylistHistory,
  savePlaylistHistory
} from "./playlists.service";
import { PlaylistApiError, type PlaylistGenerationResponse } from "./playlists.types";
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
    message: "Playlist request failed.",
    errorCode: "SERVER_ERROR"
  });
}

async function attachHistoryIfAuthenticated(userId: string | undefined, response: PlaylistGenerationResponse) {
  if (!userId) {
    return response;
  }

  try {
    const history = await savePlaylistHistory(userId, response);
    return { ...response, historyId: history.id };
  } catch (error) {
    logger.error(error instanceof Error ? error.message : "Failed to save playlist history.");
    return response;
  }
}

export async function generatePlaylistsController(req: AuthenticatedRequest, res: Response) {
  try {
    const request = validatePlaylistRequest(req.body);
    const response = await generatePlaylists(request);
    const responseWithHistory = await attachHistoryIfAuthenticated(req.authUser?.userId, response);
    return res.json(responseWithHistory);
  } catch (error) {
    return sendPlaylistError(res, error);
  }
}

export async function regeneratePlaylistsController(req: AuthenticatedRequest, res: Response) {
  try {
    const request = validatePlaylistRequest(req.body);
    const response = await generatePlaylists(request, { regenerate: true });
    const responseWithHistory = await attachHistoryIfAuthenticated(req.authUser?.userId, response);
    return res.json(responseWithHistory);
  } catch (error) {
    return sendPlaylistError(res, error);
  }
}

export async function getPlaylistHistoryController(req: AuthenticatedRequest, res: Response) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const response = await getPlaylistHistory(req.authUser!.userId, page, limit);
    return res.json({ success: true, ...response });
  } catch (error) {
    return sendPlaylistError(res, error);
  }
}

export async function deletePlaylistHistoryItemController(req: AuthenticatedRequest, res: Response) {
  try {
    await deletePlaylistHistoryItem(req.authUser!.userId, req.params.id);
    return res.json({ success: true, message: "Playlist history item deleted." });
  } catch (error) {
    return sendPlaylistError(res, error);
  }
}

export async function clearPlaylistHistoryController(req: AuthenticatedRequest, res: Response) {
  try {
    await clearPlaylistHistory(req.authUser!.userId);
    return res.json({ success: true, message: "Playlist history cleared." });
  } catch (error) {
    return sendPlaylistError(res, error);
  }
}