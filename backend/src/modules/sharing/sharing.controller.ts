import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { createShareLink, disableShareLink, getPublicSharedPlaylist, SharingError } from "./sharing.service";
import { validateCreateShareRequest, validateShareId } from "./sharing.validation";

function sendSharingError(res: Response, error: unknown) {
  if (error instanceof SharingError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode
    });
  }

  return res.status(500).json({
    success: false,
    message: "Sharing request failed.",
    errorCode: "SERVER_ERROR"
  });
}

export async function createShareController(req: AuthenticatedRequest, res: Response) {
  try {
    const { playlistHistoryId } = validateCreateShareRequest(req.body);
    const share = await createShareLink(req.authUser!.userId, playlistHistoryId);
    return res.status(201).json({
      success: true,
      shareId: share.shareId,
      shareUrl: share.shareUrl,
      message: share.reused ? "Existing active share link returned." : "Share link created successfully."
    });
  } catch (error) {
    return sendSharingError(res, error);
  }
}

export async function getSharedPlaylistController(req: Request, res: Response) {
  try {
    const shareId = validateShareId(req.params.shareId);
    const sharedPlaylist = await getPublicSharedPlaylist(shareId);
    return res.json({ success: true, sharedPlaylist });
  } catch (error) {
    return sendSharingError(res, error);
  }
}

export async function disableShareController(req: AuthenticatedRequest, res: Response) {
  try {
    const shareId = validateShareId(req.params.shareId);
    await disableShareLink(req.authUser!.userId, shareId);
    return res.json({
      success: true,
      message: "Share link disabled successfully."
    });
  } catch (error) {
    return sendSharingError(res, error);
  }
}