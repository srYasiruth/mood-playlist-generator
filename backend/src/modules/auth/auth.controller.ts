import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { getUserById, loginUser, registerUser } from "./auth.service";
import { AuthError } from "./auth.types";
import { validateLoginInput, validateRegisterInput } from "./auth.validation";

function sendAuthError(res: Response, error: unknown) {
  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errorCode: error.errorCode
    });
  }

  return res.status(500).json({
    success: false,
    message: "Authentication request failed.",
    errorCode: "SERVER_ERROR"
  });
}

export async function registerController(req: Request, res: Response) {
  try {
    const input = validateRegisterInput(req.body);
    const response = await registerUser(input);
    return res.status(201).json(response);
  } catch (error) {
    return sendAuthError(res, error);
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const input = validateLoginInput(req.body);
    const response = await loginUser(input);
    return res.json(response);
  } catch (error) {
    return sendAuthError(res, error);
  }
}

export async function meController(req: AuthenticatedRequest, res: Response) {
  try {
    const user = await getUserById(req.authUser!.userId);
    return res.json({ success: true, user });
  } catch (error) {
    return sendAuthError(res, error);
  }
}

export function logoutController(_req: Request, res: Response) {
  return res.json({
    success: true,
    message: "Logged out successfully."
  });
}
