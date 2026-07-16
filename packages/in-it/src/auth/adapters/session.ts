/**
 * @module auth/adapters/session
 * Server-side session adapter for in-it.
 *
 * Reads a session ID from a cookie, then resolves the session through
 * a user-supplied `findSession` callback. This pattern works with any
 * session store — database, Redis, KV, in-memory, etc.
 *
 * @example
 * ```ts
 * import { createAuth } from "@kotsumo/in-it/auth";
 * import { sessionAdapter } from "@kotsumo/in-it/auth/session";
 *
 * const auth = createAuth({
 *   adapter: sessionAdapter({
 *     findSession: async (sessionId) => {
 *       const row = await db.query("SELECT * FROM sessions WHERE id = ?", [sessionId]);
 *       if (!row) return null;
 *       return {
 *         user: { id: row.user_id, email: row.email, name: row.name },
 *         accessToken: sessionId,
 *         expiresAt: Math.floor(row.expires_at.getTime() / 1000),
 *       };
 *     },
 *     destroySession: async (sessionId) => {
 *       await db.query("DELETE FROM sessions WHERE id = ?", [sessionId]);
 *     },
 *   }),
 * });
 * ```
 */
import type { AuthAdapter, AuthSession } from "../types.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Session adapter configuration. */
export interface SessionAdapterOptions {
  /**
   * Look up a session by its ID.
   * Return `null` if the session does not exist or has expired.
   */
  findSession: (sessionId: string) => Promise<AuthSession | null>;

  /**
   * Optional: Destroy a session by its ID (for sign-out).
   * If not provided, sign-out only clears the cookie.
   */
  destroySession?: (sessionId: string) => Promise<void>;

  /**
   * Optional: Refresh / extend a session.
   * Return the refreshed session or `null` if refresh is not possible.
   */
  refreshSession?: (sessionId: string) => Promise<AuthSession | null>;

  /**
   * Cookie name for the session ID.
   * @default "session-id"
   */
  cookieName?: string;

  /**
   * Logout redirect URL.
   * @default "/"
   */
  logoutRedirect?: string;

  /**
   * Cookie options for clearing the session cookie on sign-out.
   * @default "Path=/; HttpOnly; SameSite=Lax"
   */
  cookieAttributes?: string;
}

// ---------------------------------------------------------------------------
// Cookie helper
// ---------------------------------------------------------------------------

function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// ---------------------------------------------------------------------------
// Adapter factory
// ---------------------------------------------------------------------------

/**
 * Create a server-side session adapter.
 *
 * Reads a session ID from a cookie and resolves the session via a callback.
 * Works with any session store — the consumer supplies the lookup logic.
 */
export function sessionAdapter(options: SessionAdapterOptions): AuthAdapter {
  const {
    findSession,
    destroySession,
    refreshSession,
    cookieName = "session-id",
    logoutRedirect = "/",
    cookieAttributes = "Path=/; HttpOnly; SameSite=Lax",
  } = options;

  return {
    async getSession(req: Request): Promise<AuthSession | null> {
      const sessionId = getCookie(req, cookieName);
      if (!sessionId) return null;

      return findSession(sessionId);
    },

    async signOut(req: Request): Promise<Response> {
      const sessionId = getCookie(req, cookieName);

      // Destroy the session in the store (if the callback exists)
      if (sessionId && destroySession) {
        try {
          await destroySession(sessionId);
        } catch {
          // Best-effort; always clear the cookie
        }
      }

      const headers = new Headers();
      headers.append(
        "Set-Cookie",
        `${cookieName}=; Max-Age=0; ${cookieAttributes}`,
      );
      headers.set("Location", logoutRedirect);
      return new Response(null, { status: 302, headers });
    },

    ...(refreshSession
      ? {
          async refreshSession(req: Request): Promise<AuthSession | null> {
            const sessionId = getCookie(req, cookieName);
            if (!sessionId) return null;
            return refreshSession(sessionId);
          },
        }
      : {}),
  };
}
