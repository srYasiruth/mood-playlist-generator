import type { User } from "./user";

export type AuthResponse = {
  success: true;
  message: string;
  user: User;
  accessToken: string;
};

export type AuthErrorResponse = {
  success: false;
  message: string;
  errorCode: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
