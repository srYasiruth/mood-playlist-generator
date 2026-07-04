import type { User } from "../types/user";

const TOKEN_KEY = "moodPlaylist.accessToken";
const USER_KEY = "moodPlaylist.user";

export function getStoredAccessToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const rawUser = window.localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    return null;
  }
}

export function storeAuth(accessToken: string, user: User) {
  window.localStorage.setItem(TOKEN_KEY, accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthStorage() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
