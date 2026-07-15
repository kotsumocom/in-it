/**
 * @module auth/middleware
 * Hono middleware for route protection.
 *
 * @example
 * ```ts
 * import { authMiddleware } from "@kotsumo/in-it/auth";
 *
 * app.use("/admin/*", authMiddleware({
 *   adapter: myAdapter,
 *   loginPath: "/login",
 *   publicPaths: ["/admin/invite"],
 * }));
 *
 * // Access user in handlers:
 * app.get("/admin/dashboard", (c) => {
 *   const user = c.get("authUser");
 *   return c.json({ hello: user.name });
 * });
 * ```
 */
import type { Context, Next, MiddlewareHandler } from "hono";
import type { AuthAdapter, AuthUser, AuthSession } from "./types.ts";

/** Options for the auth middleware. */
export interface AuthMiddlewareOptions {
  /** The auth adapter to use for session extraction. */
  adapter: AuthAdapter;
  /**
   * Path to redirect unauthenticated users to.
   * Set to `false` to return 401 JSON instead of redirecting.
   * @default "/login"
   */
  loginPath?: string | false;
  /** Paths that skip authentication (exact match or prefix with trailing *). */
  publicPaths?: string[];
  /**
   * Called when authentication fails, before redirect/401.
   * Return a Response to override default behavior.
   */
  onUnauthenticated?: (c: Context) => Response | Promise<Response> | void;
}

/**
 * Check if a path matches any of the public paths.
 * Supports exact match and wildcard prefix (e.g. "/api/public/*").
 */
function isPublicPath(path: string, publicPaths: string[]): boolean {
  for (const pp of publicPaths) {
    if (pp.endsWith("/*")) {
      const prefix = pp.slice(0, -2);
      if (path === prefix || path.startsWith(prefix + "/")) return true;
    } else if (pp === path) {
      return true;
    }
  }
  return false;
}

/**
 * Create a Hono middleware that protects routes with authentication.
 *
 * On success, sets `authUser` and `authSession` in the Hono context.
 * On failure, redirects to loginPath or returns 401.
 */
export function authMiddleware(options: AuthMiddlewareOptions): MiddlewareHandler {
  const {
    adapter,
    loginPath = "/login",
    publicPaths = [],
    onUnauthenticated,
  } = options;

  return async (c: Context, next: Next) => {
    // Skip auth for public paths
    const path = new URL(c.req.url).pathname;
    if (publicPaths.length > 0 && isPublicPath(path, publicPaths)) {
      return next();
    }

    // Try to get session
    let session = await adapter.getSession(c.req.raw);

    // Attempt refresh if session expired
    if (!session && adapter.refreshSession) {
      session = await adapter.refreshSession(c.req.raw);
    }

    if (session) {
      // Authenticated — set context variables
      c.set("authUser" as never, session.user as never);
      c.set("authSession" as never, session as never);
      return next();
    }

    // Unauthenticated
    if (onUnauthenticated) {
      const resp = await onUnauthenticated(c);
      if (resp) return resp;
    }

    if (loginPath === false) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Redirect to login with return path
    const returnTo = encodeURIComponent(path);
    return c.redirect(`${loginPath}?returnTo=${returnTo}`);
  };
}
