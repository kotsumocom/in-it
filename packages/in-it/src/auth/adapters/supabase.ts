/**
 * @module auth/adapters/supabase
 * Supabase Auth adapter for in-it.
 *
 * @example
 * ```ts
 * import { createAuth } from "@kotsumo/in-it/auth";
 * import { supabaseAdapter } from "@kotsumo/in-it/auth/supabase";
 *
 * const auth = createAuth({
 *   adapter: supabaseAdapter({
 *     url: Deno.env.get("SUPABASE_URL")!,
 *     anonKey: Deno.env.get("SUPABASE_ANON_KEY")!,
 *   }),
 * });
 * ```
 */
import type { AuthAdapter, AuthSession, AuthUser } from "../types.ts";

/** Supabase adapter configuration. */
export interface SupabaseAdapterOptions {
  /** Supabase project URL. */
  url: string;
  /** Supabase anon (public) key. */
  anonKey: string;
  /** Name of the cookie containing the access token. Default: "sb-access-token" */
  cookieName?: string;
  /** Name of the cookie containing the refresh token. Default: "sb-refresh-token" */
  refreshCookieName?: string;
  /** Logout redirect URL. Default: "/" */
  logoutRedirect?: string;
}

/**
 * Parse a cookie header and extract a cookie value by name.
 */
function getCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get("cookie");
  if (!header) return undefined;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Call the Supabase Auth API to get the user from an access token.
 */
async function supabaseGetUser(
  url: string,
  anonKey: string,
  accessToken: string,
): Promise<{ user: Record<string, unknown> } | null> {
  try {
    const res = await fetch(`${url}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: anonKey,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

/**
 * Call the Supabase Auth API to refresh a session.
 */
async function supabaseRefreshSession(
  url: string,
  anonKey: string,
  refreshToken: string,
): Promise<{ access_token: string; refresh_token: string; expires_at: number; user: Record<string, unknown> } | null> {
  try {
    const res = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Map Supabase user object to AuthUser. */
function mapUser(supaUser: Record<string, unknown>): AuthUser {
  const meta = (supaUser.user_metadata ?? {}) as Record<string, unknown>;
  return {
    id: supaUser.id as string,
    email: supaUser.email as string | undefined,
    name: (meta.full_name ?? meta.name ?? meta.display_name) as string | undefined,
    avatarUrl: (meta.avatar_url ?? meta.picture) as string | undefined,
    metadata: meta,
  };
}

/**
 * Create a Supabase Auth adapter.
 *
 * Uses the Supabase REST API directly — does NOT depend on `@supabase/supabase-js`.
 * Reads access/refresh tokens from cookies set by the Supabase client.
 */
export function supabaseAdapter(options: SupabaseAdapterOptions): AuthAdapter {
  const {
    url,
    anonKey,
    cookieName = "sb-access-token",
    refreshCookieName = "sb-refresh-token",
    logoutRedirect = "/",
  } = options;

  return {
    async getSession(req: Request): Promise<AuthSession | null> {
      const accessToken = getCookie(req, cookieName);
      if (!accessToken) return null;

      const result = await supabaseGetUser(url, anonKey, accessToken);
      if (!result?.user) return null;

      return {
        user: mapUser(result.user),
        accessToken,
        refreshToken: getCookie(req, refreshCookieName),
      };
    },

    async signOut(_req: Request): Promise<Response> {
      // Clear auth cookies and redirect
      const headers = new Headers();
      headers.append("Set-Cookie", `${cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
      headers.append("Set-Cookie", `${refreshCookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
      headers.set("Location", logoutRedirect);
      return new Response(null, { status: 302, headers });
    },

    async refreshSession(req: Request): Promise<AuthSession | null> {
      const refreshToken = getCookie(req, refreshCookieName);
      if (!refreshToken) return null;

      const result = await supabaseRefreshSession(url, anonKey, refreshToken);
      if (!result) return null;

      return {
        user: mapUser(result.user),
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        expiresAt: result.expires_at,
      };
    },
  };
}
