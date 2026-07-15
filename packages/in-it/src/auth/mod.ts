/**
 * @module auth
 * Authentication layer for in-it.
 *
 * Provides an adapter-based auth system that works with any auth provider.
 * in-it defines only the interfaces; concrete implementations are adapters.
 *
 * @example
 * ```ts
 * import { createAuth } from "@kotsumo/in-it/auth";
 * import { supabaseAdapter } from "@kotsumo/in-it/auth/supabase";
 *
 * const auth = createAuth({
 *   adapter: supabaseAdapter({ url: "...", anonKey: "..." }),
 *   loginPath: "/login",
 *   publicPaths: ["/", "/about", "/api/public/*"],
 * });
 *
 * // Protect routes
 * app.use("/admin/*", auth.middleware());
 *
 * // Access user in handlers
 * app.get("/admin/profile", (c) => {
 *   const user = auth.getUser(c);
 *   return c.json(user);
 * });
 * ```
 */
import type { Context, MiddlewareHandler } from "hono";
import type { AuthAdapter, AuthUser, AuthSession } from "./types.ts";
import { authMiddleware } from "./middleware.ts";
import type { AuthMiddlewareOptions } from "./middleware.ts";

// Re-export types
export type { AuthAdapter, AuthUser, AuthSession } from "./types.ts";
export type { AuthMiddlewareOptions } from "./middleware.ts";
export { authMiddleware } from "./middleware.ts";

/** Options for createAuth. */
export interface CreateAuthOptions {
  /** The auth adapter to use. */
  adapter: AuthAdapter;
  /**
   * Login redirect path.
   * Set to `false` to return 401 JSON instead.
   * @default "/login"
   */
  loginPath?: string | false;
  /** Paths that skip authentication. */
  publicPaths?: string[];
  /** Called when authentication fails. */
  onUnauthenticated?: (c: Context) => Response | Promise<Response> | void;
}

/** Auth instance returned by createAuth. */
export interface Auth {
  /** Create a Hono middleware for route protection. */
  middleware(): MiddlewareHandler;
  /** Get the authenticated user from a Hono context (set by middleware). */
  getUser(c: Context): AuthUser | undefined;
  /** Get the full session from a Hono context (set by middleware). */
  getSession(c: Context): AuthSession | undefined;
  /** The underlying adapter. */
  adapter: AuthAdapter;
}

/**
 * Create an auth instance.
 *
 * This is the main entry point for using authentication in in-it.
 * It wraps the adapter with convenient helpers.
 */
export function createAuth(options: CreateAuthOptions): Auth {
  const { adapter, loginPath, publicPaths, onUnauthenticated } = options;

  return {
    middleware(): MiddlewareHandler {
      return authMiddleware({
        adapter,
        loginPath,
        publicPaths,
        onUnauthenticated,
      });
    },

    getUser(c: Context): AuthUser | undefined {
      return c.get("authUser" as never) as AuthUser | undefined;
    },

    getSession(c: Context): AuthSession | undefined {
      return c.get("authSession" as never) as AuthSession | undefined;
    },

    adapter,
  };
}
