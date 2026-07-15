/**
 * @module auth/types
 * Authentication adapter interfaces for in-it.
 *
 * in-it defines only the interface — concrete implementations
 * are provided as adapters (e.g. supabaseAdapter, firebaseAdapter).
 *
 * @example
 * ```ts
 * import { createAuth } from "@kotsumo/in-it/auth";
 * import { supabaseAdapter } from "@kotsumo/in-it/auth/supabase";
 *
 * const auth = createAuth({
 *   adapter: supabaseAdapter({ url: "...", anonKey: "..." }),
 * });
 *
 * app.use("/admin/*", auth.middleware());
 * ```
 */

/** Authenticated user. */
export interface AuthUser {
  /** Unique user ID from the auth provider. */
  id: string;
  /** Email address (may be absent for social-only logins). */
  email?: string;
  /** Display name. */
  name?: string;
  /** Avatar image URL. */
  avatarUrl?: string;
  /** Provider-specific metadata. */
  metadata?: Record<string, unknown>;
}

/** Authenticated session containing user and token info. */
export interface AuthSession {
  /** The authenticated user. */
  user: AuthUser;
  /** Access token string (JWT or opaque). */
  accessToken: string;
  /** Token expiry as Unix timestamp (seconds). */
  expiresAt?: number;
  /** Refresh token (if applicable). */
  refreshToken?: string;
}

/**
 * Auth adapter interface.
 *
 * Implement this to connect any auth service to in-it.
 * Each method receives the raw `Request` so it can read cookies/headers.
 */
export interface AuthAdapter {
  /**
   * Extract a session from the incoming request.
   * Returns `null` if the request is not authenticated.
   */
  getSession(req: Request): Promise<AuthSession | null>;

  /**
   * Convenience: extract only the user from the request.
   * Default implementation calls `getSession()` and returns `session.user`.
   */
  getUser?(req: Request): Promise<AuthUser | null>;

  /**
   * Handle sign-out. Should clear cookies/tokens and return a redirect Response.
   */
  signOut(req: Request): Promise<Response>;

  /**
   * Optional: Refresh an expired session.
   * Returns the refreshed session or null if refresh failed.
   */
  refreshSession?(req: Request): Promise<AuthSession | null>;
}
