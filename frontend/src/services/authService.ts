import { apiClient } from "./apiClient";
import type { AuthResponse, LoginInput, RegisterInput } from "../types/auth";
import type { User } from "../types/user";
import { clearAuthStorage, getStoredAccessToken, getStoredUser, storeAuth } from "../utils/authStorage";

export function getInitialAuthState() {
  return {
    accessToken: getStoredAccessToken(),
    user: getStoredUser()
  };
}

export async function register(input: RegisterInput) {
  const response = await apiClient.post<AuthResponse>("/api/auth/register", input);
  storeAuth(response.data.accessToken, response.data.user);
  return response.data;
}

export async function login(input: LoginInput) {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", input);
  storeAuth(response.data.accessToken, response.data.user);
  return response.data;
}

export async function getMe() {
  const response = await apiClient.get<{ success: true; user: User }>("/api/auth/me");
  return response.data.user;
}

export async function logout() {
  try {
    await apiClient.post("/api/auth/logout");
  } finally {
    clearAuthStorage();
  }
}

export function clearAuth() {
  clearAuthStorage();
}
