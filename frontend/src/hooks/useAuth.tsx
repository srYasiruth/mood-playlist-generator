import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import * as authService from "../services/authService";
import type { LoginInput, RegisterInput } from "../types/auth";
import type { User } from "../types/user";
import { storeAuth } from "../utils/authStorage";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionMessage: string | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const initialState = authService.getInitialAuthState();
  const [user, setUser] = useState<User | null>(initialState.user);
  const [isLoading, setIsLoading] = useState(Boolean(initialState.accessToken && !initialState.user));
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    if (!authService.getInitialAuthState().accessToken) {
      setUser(null);
      return;
    }

    setIsLoading(true);
    try {
      const currentUser = await authService.getMe();
      const accessToken = authService.getInitialAuthState().accessToken;
      if (accessToken) {
        storeAuth(accessToken, currentUser);
      }
      setUser(currentUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      setSessionMessage("Your session expired. Please log in again.");
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  useEffect(() => {
    if (initialState.accessToken && !initialState.user) {
      refreshUser().catch(() => setUser(null));
    }
  }, [initialState.accessToken, initialState.user, refreshUser]);

  const login = useCallback(async (input: LoginInput) => {
    const response = await authService.login(input);
    setUser(response.user);
    setSessionMessage(null);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const response = await authService.register(input);
    setUser(response.user);
    setSessionMessage(null);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setSessionMessage(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      sessionMessage,
      login,
      register,
      logout,
      refreshUser
    }),
    [isLoading, login, logout, refreshUser, register, sessionMessage, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
