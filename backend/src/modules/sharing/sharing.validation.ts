import { z } from "zod";
import { SharingError } from "./sharing.service";

const createShareSchema = z.object({
  playlistHistoryId: z.string({ required_error: "Playlist history id is required." }).trim().min(1)
});

const shareIdSchema = z.string().trim().min(8).max(80).regex(/^[A-Za-z0-9_-]+$/);

export function validateCreateShareRequest(body: unknown) {
  const parsed = createShareSchema.safeParse(body);
  if (!parsed.success) {
    throw new SharingError("Playlist history id is required.", "INVALID_INPUT", 400);
  }
  return parsed.data;
}

export function validateShareId(shareId: unknown) {
  const parsed = shareIdSchema.safeParse(shareId);
  if (!parsed.success) {
    throw new SharingError("Shared playlist not found.", "NOT_FOUND", 404);
  }
  return parsed.data;
}