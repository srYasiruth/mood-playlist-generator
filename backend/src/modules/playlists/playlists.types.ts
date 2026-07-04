export type PlaylistSource = "spotify" | "fallback";
export type PlaylistInputType = "manual" | "text";

export type PlaylistErrorCode =
  | "INVALID_INPUT"
  | "INVALID_MOOD"
  | "API_ERROR"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "SPOTIFY_NOT_CONFIGURED";

export type PlaylistItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  externalUrl: string;
  trackCount?: number;
  source: string;
  mood: string;
};

export type PlaylistGenerationRequest = {
  mood: string;
  source: PlaylistSource;
  limit: number;
  inputType: PlaylistInputType;
};

export type PlaylistGenerationResponse = {
  success: true;
  mood: string;
  query: string;
  source: string;
  playlists: PlaylistItem[];
  inputType: PlaylistInputType;
  historyId?: string;
  meta: {
    cached: boolean;
    fallbackUsed: boolean;
    generatedAt: string;
    message?: string;
  };
};

export type PlaylistErrorResponse = {
  success: false;
  message: string;
  errorCode: PlaylistErrorCode;
};

export class PlaylistApiError extends Error {
  statusCode: number;
  errorCode: PlaylistErrorCode;

  constructor(message: string, errorCode: PlaylistErrorCode, statusCode = 500) {
    super(message);
    this.name = "PlaylistApiError";
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}