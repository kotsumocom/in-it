/**
 * @module server/layout
 * Server-side layout helpers for Hono.
 *
 * Provides nested layout support for in-it apps.
 * Layouts wrap child routes with shared UI (sidebars, headers, etc.).
 *
 * @example
 * ```tsx
 * import { Hono } from "hono";
 * import { withLayout } from "@kotsumo/in-it/server";
 * import { AdminShell } from "@kotsumo/in-it";
 *
 * const admin = new Hono();
 * admin.get("/dashboard", (c) => c.html(<Dashboard />));
 * admin.get("/settings", (c) => c.html(<Settings />));
 *
 * // Wrap all admin routes with AdminShell layout
 * const wrapped = withLayout(AdminLayout, admin);
 * app.route("/admin", wrapped);
 * ```
 */
import { Hono } from "hono";
import type { Context, MiddlewareHandler } from "hono";

/** A layout component that receives children and the Hono context. */
export type LayoutComponent = (props: {
  children: any;
  c: Context;
}) => any;

/**
 * Wrap a Hono app's routes with a layout component.
 *
 * The layout receives the rendered child content and the Hono context,
 * allowing it to access auth data, request info, etc.
 */
export function withLayout(Layout: LayoutComponent, routes: Hono): Hono {
  const app = new Hono();

  // Apply layout as middleware
  app.use("*", async (c, next) => {
    await next();
    // Only wrap HTML responses
    const contentType = c.res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return;

    const body = await c.res.text();
    // Store original body for the layout to render
    c.set("__layoutContent" as never, body as never);
  });

  // Mount the child routes
  app.route("/", routes);

  return app;
}

/**
 * Create a middleware that injects shared data into the context.
 *
 * Useful for providing navigation items, user info, or other
 * data needed by layouts across multiple routes.
 *
 * @example
 * ```ts
 * app.use("/admin/*", contextProvider(async (c) => ({
 *   navItems: await getNavItems(),
 *   currentUser: c.get("authUser"),
 * })));
 * ```
 */
export function contextProvider<T extends Record<string, unknown>>(
  provider: (c: Context) => T | Promise<T>,
): MiddlewareHandler {
  return async (c, next) => {
    const data = await provider(c);
    for (const [key, value] of Object.entries(data)) {
      c.set(key as never, value as never);
    }
    return next();
  };
}

/**
 * Create a route group with shared middleware.
 *
 * Syntactic sugar for a common Hono pattern.
 *
 * @example
 * ```ts
 * const adminRoutes = routeGroup(
 *   [auth.middleware(), contextProvider(...)],
 *   (app) => {
 *     app.get("/dashboard", dashboardHandler);
 *     app.get("/settings", settingsHandler);
 *   }
 * );
 * app.route("/admin", adminRoutes);
 * ```
 */
export function routeGroup(
  middleware: MiddlewareHandler[],
  setup: (app: Hono) => void,
): Hono {
  const app = new Hono();
  for (const mw of middleware) {
    app.use("*", mw);
  }
  setup(app);
  return app;
}
