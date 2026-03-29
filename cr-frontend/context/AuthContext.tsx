"use client";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

export interface User {
  email: string;
  name: string;
  sub: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password?: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock JWT
    const token = localStorage.getItem("cococash_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          email: payload.email,
          name: payload.name,
          sub: payload.sub
        });
      } catch (e) {
        localStorage.removeItem("cococash_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    // Mock login -> generate fake JWT
    const payload = {
      sub: "12345",
      email,
      name: email.split("@")[0],
    };
    const fakeToken = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem("cococash_token", fakeToken);
    setUser(payload);
  };

  const register = async (email: string, password?: string, name?: string) => {
    // Mock register
    return;
  };

  const logout = () => {
    localStorage.removeItem("cococash_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
