export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function parseAuthErrorResponse(
  status: number,
  data: Record<string, unknown>
): AuthError {
  const detail = data.detail;
  const message = data.message;

  if (typeof detail === "string") {
    return new AuthError(detail, detail);
  }

  if (typeof message === "string") {
    return new AuthError(message, message);
  }

  if (status === 404) {
    return new AuthError("USER_NOT_FOUND", "USER_NOT_FOUND");
  }

  if (status === 422) {
    return new AuthError("INVALID_EMAIL", "INVALID_EMAIL");
  }

  return new AuthError("Authentication failed", "AUTH_FAILED");
}
