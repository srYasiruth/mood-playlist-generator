import { prisma } from "../../config/database";
import { signAccessToken } from "../../utils/jwt";
import { comparePassword, hashPassword } from "../../utils/password";
import { AuthError, type SafeUser } from "./auth.types";
import type { LoginInput, RegisterInput } from "./auth.validation";

function toSafeUser(user: { id: string; name: string; email: string; role: string }): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

function buildAuthResponse(message: string, user: SafeUser) {
  return {
    success: true as const,
    message,
    user,
    accessToken: signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })
  };
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingUser) {
    throw new AuthError("An account with this email already exists.", "INVALID_INPUT", 409);
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password)
    },
    select: { id: true, name: true, email: true, role: true }
  });

  return buildAuthResponse("Registration successful.", toSafeUser(user));
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AuthError("Invalid email or password.", "UNAUTHORIZED", 401);
  }

  const passwordMatches = await comparePassword(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new AuthError("Invalid email or password.", "UNAUTHORIZED", 401);
  }

  return buildAuthResponse(
    "Login successful.",
    toSafeUser({ id: user.id, name: user.name, email: user.email, role: user.role })
  );
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true }
  });

  if (!user) {
    throw new AuthError("User not found.", "NOT_FOUND", 404);
  }

  return toSafeUser(user);
}
