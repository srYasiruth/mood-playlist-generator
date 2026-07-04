export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  success: true;
  message: string;
  user: SafeUser;
  accessToken: string;
};

export class AuthError extends Error {
  statusCode: number;
  errorCode: "INVALID_INPUT" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "SERVER_ERROR";

  constructor(message: string, errorCode: AuthError["errorCode"], statusCode = 400) {
    super(message);
    this.name = "AuthError";
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
