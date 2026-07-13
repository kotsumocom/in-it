/**
 * Auth middleware skeleton.
 *
 * Replace the TODO with your auth provider (Supabase Auth, Auth0, etc.)
 * This middleware extracts and validates the user session.
 */
import type { MiddlewareHandler } from "hono";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

/**
 * Require authentication for a route.
 * Sets `c.get("user")` to the authenticated user.
 */
export const requireAuth: MiddlewareHandler = async (c, next) => {
  // TODO: Replace with your auth provider
  //
  // Example with Supabase Auth:
  //   const token = c.req.header("Authorization")?.replace("Bearer ", "");
  //   if (!token) return c.json({ error: "Unauthorized" }, 401);
  //   const { data: { user }, error } = await supabase.auth.getUser(token);
  //   if (error || !user) return c.json({ error: "Unauthorized" }, 401);
  //   c.set("user", { id: user.id, email: user.email });
  //
  // Example with JWT:
  //   import { verify } from "hono/utils/jwt";
  //   const token = c.req.header("Authorization")?.replace("Bearer ", "");
  //   if (!token) return c.json({ error: "Unauthorized" }, 401);
  //   const payload = await verify(token, Deno.env.get("JWT_SECRET")!);
  //   c.set("user", payload);

  // For development: mock user
  c.set("user", {
    id: "dev-user",
    email: "dev@example.com",
    name: "Dev User",
    role: "admin",
  } satisfies AuthUser);

  await next();
};

/**
 * Optional auth — sets user if authenticated, but doesn't block.
 */
export const optionalAuth: MiddlewareHandler = async (c, next) => {
  // TODO: Same as above, but don't return 401
  c.set("user", null);
  await next();
};
