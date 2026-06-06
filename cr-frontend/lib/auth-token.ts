import type { User } from "@/context/AuthContext";

const TOKEN_KEY = "cococash_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function parseToken(token: string): User {
  const payload = JSON.parse(atob(token.split(".")[1]));

  if (!payload.email || !payload.wallet_id) {
    throw new Error("Invalid token payload");
  }

  return {
    email: payload.email,
    name: payload.name,
    sub: payload.sub,
    wallet_id: payload.wallet_id,
  };
}

export function saveToken(token: string): User {
  localStorage.setItem(TOKEN_KEY, token);
  return parseToken(token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
