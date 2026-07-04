import { z } from "zod";
import { AuthError } from "./auth.types";

const registerSchema = z
  .object({
    name: z.string().trim().min(2),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export function validateRegisterInput(body: unknown) {
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw new AuthError("Invalid registration input.", "INVALID_INPUT", 400);
  }
  return parsed.data;
}

export function validateLoginInput(body: unknown) {
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    throw new AuthError("Invalid login input.", "INVALID_INPUT", 400);
  }
  return parsed.data;
}
