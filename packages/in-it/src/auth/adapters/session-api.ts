/**
 * @module auth/adapters/session-api
 * Session-API adapter for in-it.
 *
 * Designed for auth systems that expose an HTTP endpoint returning the
 * current session (e.g. Better Auth `/api/auth/get-session`,
 * NextAuth `/api/auth/session`, or any custom endpoint).
 *
 * The adapter proxies the incoming request's cookies/headers to the
 * session endpoint, parses the response, and maps it to in-it's
 * `AuthSession` type.
 *
 * @example
 * ```ts
 * import { createAuth } from "@kotsumo/in-it/auth";
 * import { sessionApiAdapter } from "@kotsumo/in-it/auth/session-api";
 *
 * // Better Auth (duck-typing — no @better-auth dependency)
 * const auth = createAuth({
 *   adapter: sessionApiAdapter({
 *     sessionUrl: "http://localhost:3000/api/auth/get-session",
 *     mapSession: (data) => ({
 *       user: {
 *         id: data.user.id,
 *         email: data.user.email,
 *         name: data.user.name,
 *       },
 *       accessToken: data.session.token,
 *       expiresAt: Math.floor(new Date(data.session.expiresAt).getTime() / 1000),
 *     }),
 *     signOutUrl: "http://localhost:3000/api/auth/sign-out",
 *   }),
 * });
 * ```
 */
import type { AuthAdapter, AuthSession } from "../types.ts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Session API adapter configuration. */
export interface SessionApiAdapterOptions {
  /**
   * The URL of the session endpoint to call.
   * The adapter forwards the incoming request's `Cookie` header to this URL.
   */
  sessionUrl: string;

  /**
   * Map the JSON response from the session endpoint to an `AuthSession`.
   * Return `null` if the response indicates no active session.
   */
  mapSession: (data: Record<string, unknown>) => AuthSession | null;

  /**
   * Optional: URL of the sign-out endpoint.
   * The adapter sends a POST request with the incoming cookies.
   * If not provided, sign-out clears cookies and redirects.
   */
  signOutUrl?: string;

  /**
   * Sign-out HTTP method.
   * @default "POST"
   */
  signOutMethod?: string;

  /**
   * Optional: URL of the session refresh endpoint.
   * If provided, the adapter calls this endpoint on refresh.
   */
  refreshUrl?: string;

  /**
   * Map the JSON response from the refresh endpoint to an `AuthSession`.
   * Defaults to `mapSession` if not provided.
   */
  mapRefreshSession?: (data: Record<string, unknown>) => AuthSession | null;

  /**
   * Additional headers to include in requests to the session endpoint.
   */
  headers?: Record<string, string>;

  /**
   * Timeout for the session endpoint request in milliseconds.
   * @default 5000
   */
  timeout?: number;

  /**
   * Logout redirect URL (used when `signOutUrl` is not provided).
   * @default "/"
   */
  logoutRedirect?: string;

  /**
   * Cookie names to clear on sign-out (when `signOutUrl` is not provided).
   */
  cookieNames?: string[];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function fetchSession(
  url: string,
  req: Request,
  extraHeaders?: Record<string, string>,
  timeout = 5000,
): Promise<Record<string, unknown> | null> {
  const headers = new Headers(extraHeaders);

  // Forward cookies from the incoming request
  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.set("cookie", cookie);
  }

  // Forward Authorization header if present
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    headers.set("authorization", authHeader);
  }

  headers.set("accept", "application/json");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const res = await fetch(url, {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return null;

    const data = await res.json();

    // Many session endpoints return `null` or `{}` for unauthenticated
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return null;
    }

    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Adapter factory
// ---------------------------------------------------------------------------

/**
 * Create a Session-API adapter.
 *
 * Calls an HTTP session endpoint, forwarding the incoming request's cookies,
 * and maps the response to an `AuthSession`.
 *
 * This adapter works with any auth system that exposes a session endpoint,
 * including Better Auth, NextAuth, Lucia, and custom implementations.
 */
export function sessionApiAdapter(options: SessionApiAdapterOptions): AuthAdapter {
  const {
    sessionUrl,
    mapSession,
    signOutUrl,
    signOutMethod = "POST",
    refreshUrl,
    mapRefreshSession = mapSession,
    headers: extraHeaders,
    timeout = 5000,
    logoutRedirect = "/",
    cookieNames = [],
  } = options;

  return {
    async getSession(req: Request): Promise<AuthSession | null> {
      const data = await fetchSession(sessionUrl, req, extraHeaders, timeout);
      if (!data) return null;
      return mapSession(data);
    },

    async signOut(req: Request): Promise<Response> {
      // If a sign-out endpoint is available, call it
      if (signOutUrl) {
        try {
          const headers = new Headers(extraHeaders);
          const cookie = req.headers.get("cookie");
          if (cookie) headers.set("cookie", cookie);
          headers.set("content-type", "application/json");

          await fetch(signOutUrl, {
            method: signOutMethod,
            headers,
          });
        } catch {
          // Best-effort
        }
      }

      // Clear cookies and redirect
      const resHeaders = new Headers();
      for (const name of cookieNames) {
        resHeaders.append(
          "Set-Cookie",
          `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
        );
      }
      resHeaders.set("Location", logoutRedirect);
      return new Response(null, { status: 302, headers: resHeaders });
    },

    ...(refreshUrl
      ? {
          async refreshSession(req: Request): Promise<AuthSession | null> {
            const data = await fetchSession(refreshUrl, req, extraHeaders, timeout);
            if (!data) return null;
            return mapRefreshSession(data);
          },
        }
      : {}),
  };
}
