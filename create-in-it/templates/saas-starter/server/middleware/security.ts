/**
 * Security middleware — CSP headers, CSRF protection, XSS protection.
 *
 * These headers are applied to all responses by default.
 */
import type { MiddlewareHandler } from "hono";

/**
 * Returns a middleware that sets security headers on all responses.
 */
export function securityHeaders(): MiddlewareHandler {
  return async (c, next) => {
    await next();

    // Content Security Policy — adjust as needed
    c.header(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
      ].join("; "),
    );

    // Prevent clickjacking
    c.header("X-Frame-Options", "DENY");

    // Prevent MIME sniffing
    c.header("X-Content-Type-Options", "nosniff");

    // Referrer policy
    c.header("Referrer-Policy", "strict-origin-when-cross-origin");

    // Permissions policy
    c.header(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
  };
}

/**
 * CSRF protection middleware.
 * Uses the double-submit cookie pattern.
 *
 * Usage:
 *   app.use("/api/*", csrfProtection());
 */
export function csrfProtection(): MiddlewareHandler {
  return async (c, next) => {
    const method = c.req.method;

    // Safe methods don't need CSRF protection
    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
      return next();
    }

    const cookieToken = c.req.cookie("csrf-token");
    const headerToken = c.req.header("X-CSRF-Token");

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return c.json({ error: "CSRF token mismatch" }, 403);
    }

    await next();
  };
}
