import crypto from "crypto";
import { prisma } from "../../config/database";
import { env } from "../../config/env";
import type { PlaylistGenerationResponse, PlaylistItem } from "../playlists/playlists.types";

export type SharingErrorCode = "INVALID_INPUT" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "SERVER_ERROR";

export class SharingError extends Error {
  statusCode: number;
  errorCode: SharingErrorCode;

  constructor(message: string, errorCode: SharingErrorCode, statusCode = 500) {
    super(message);
    this.name = "SharingError";
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

function generateShareId() {
  return crypto.randomBytes(18).toString("base64url");
}

function buildShareUrl(shareId: string) {
  return env.FRONTEND_URL ? `${env.FRONTEND_URL.replace(/\/$/, "")}/share/${shareId}` : undefined;
}

function normalizePlaylists(resultData: unknown): PlaylistItem[] {
  const response = resultData as Partial<PlaylistGenerationResponse> | null;
  return Array.isArray(response?.playlists) ? response.playlists : [];
}

function toPublicSharedPlaylist(share: {
  shareId: string;
  createdAt: Date;
  playlistHistory: {
    mood: string;
    inputType: string;
    apiSource: string;
    searchQuery: string | null;
    resultData: unknown;
    createdAt: Date;
  } | null;
}) {
  if (!share.playlistHistory) {
    throw new SharingError("Shared playlist not found.", "NOT_FOUND", 404);
  }

  return {
    shareId: share.shareId,
    mood: share.playlistHistory.mood,
    inputType: share.playlistHistory.inputType,
    source: share.playlistHistory.apiSource,
    query: share.playlistHistory.searchQuery ?? undefined,
    createdAt: share.createdAt.toISOString(),
    generatedAt: share.playlistHistory.createdAt.toISOString(),
    playlists: normalizePlaylists(share.playlistHistory.resultData)
  };
}

async function createUniqueShareId() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const shareId = generateShareId();
    const existing = await prisma.sharedPlaylist.findUnique({ where: { shareId } });
    if (!existing) {
      return shareId;
    }
  }

  throw new SharingError("Could not create a share link. Please try again.", "SERVER_ERROR", 500);
}

export async function createShareLink(userId: string, playlistHistoryId: string) {
  const history = await prisma.playlistHistory.findUnique({ where: { id: playlistHistoryId } });
  if (!history) {
    throw new SharingError("Playlist history item not found.", "NOT_FOUND", 404);
  }

  if (history.userId !== userId) {
    throw new SharingError("You cannot share this playlist history item.", "FORBIDDEN", 403);
  }

  const existing = await prisma.sharedPlaylist.findFirst({
    where: {
      userId,
      playlistHistoryId,
      isActive: true
    },
    orderBy: { createdAt: "desc" }
  });

  if (existing) {
    return {
      shareId: existing.shareId,
      shareUrl: buildShareUrl(existing.shareId),
      reused: true
    };
  }

  const shareId = await createUniqueShareId();
  const share = await prisma.sharedPlaylist.create({
    data: {
      shareId,
      userId,
      playlistHistoryId,
      isActive: true
    }
  });

  return {
    shareId: share.shareId,
    shareUrl: buildShareUrl(share.shareId),
    reused: false
  };
}

export async function getPublicSharedPlaylist(shareId: string) {
  const share = await prisma.sharedPlaylist.findUnique({
    where: { shareId },
    include: {
      playlistHistory: {
        select: {
          mood: true,
          inputType: true,
          apiSource: true,
          searchQuery: true,
          resultData: true,
          createdAt: true
        }
      }
    }
  });

  if (!share || !share.isActive || !share.playlistHistory) {
    throw new SharingError("Shared playlist not found.", "NOT_FOUND", 404);
  }

  if (share.expiresAt && share.expiresAt.getTime() < Date.now()) {
    throw new SharingError("Shared playlist not found.", "NOT_FOUND", 404);
  }

  return toPublicSharedPlaylist(share);
}

export async function disableShareLink(userId: string, shareId: string) {
  const share = await prisma.sharedPlaylist.findUnique({ where: { shareId } });
  if (!share || !share.isActive) {
    throw new SharingError("Shared playlist not found.", "NOT_FOUND", 404);
  }

  if (share.userId !== userId) {
    throw new SharingError("You cannot disable this share link.", "FORBIDDEN", 403);
  }

  await prisma.sharedPlaylist.update({
    where: { shareId },
    data: { isActive: false }
  });
}

export function getShareUrl(shareId: string) {
  return buildShareUrl(shareId);
}