import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database";
import { verifyAccessToken, type JwtPayload } from "../utils/jwt";

export type AuthUser = JwtPayload & {
  name?: string;
};

export type AuthenticatedRequest = Request & {
  authUser?: AuthUser;
};

function extractBearerToken(req: Request) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

function unauthorized(res: Response, message = "Authentication required.") {
  return res.status(401).json({
    success: false,
    message,
    errorCode: "UNAUTHORIZED"
  });
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return unauthorized(res);
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return unauthorized(res, "Invalid or expired session.");
    }

    req.authUser = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    return next();
  } catch {
    return unauthorized(res, "Invalid or expired session.");
  }
}

export async function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (user) {
      req.authUser = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      };
    }
  } catch {
    // Guest playlist generation should keep working even if an optional token is stale.
  }

  return next();
}
