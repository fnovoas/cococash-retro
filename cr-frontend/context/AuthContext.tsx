"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { API_BASE } from "@/lib/api";
import {
  clearToken,
  getStoredToken,
  parseToken,
  saveToken,
} from "@/lib/auth-token";
import { AuthError, parseAuthErrorResponse } from "@/lib/auth-errors";

export interface User {
  email: string;
  name: string;
  sub: string;
  wallet_id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

async function authenticate(
  endpoint: string,
  body: Record<string, string>
): Promise<User> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw parseAuthErrorResponse(res.status, data);
  }

  const { token } = data as { token: string };
  return saveToken(token);
}

export { AuthError };

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      try {
        setUser(parseToken(token));
      } catch {
        clearToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setUser(await authenticate("/auth/login", { email, password: password ?? "" }));
  };

  const register = async (email: string, password: string, name: string) => {
    setUser(await authenticate("/auth/register", { email, password, name }));
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
