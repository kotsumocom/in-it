/**
 * @module server/security
 * Composable security utilities for Hono-based servers.
 *
 * Provides small, focused middleware functions that can be used
 * individually or combined. Avoids monolithic security middleware
 * in favor of composable building blocks.
 *
 * @example
 * ```ts
 * import { securityHeaders, csp, csrfProtection } from "@kotsumo/in-it/server";
 *
 * app.use("*", securityHeaders());
 * app.use("*", csp({ connectSrc: ["https://*.supabase.co"] }));
 * app.use("*", csrfProtection());
 * ```
 */
import type { Context, Next, MiddlewareHandler } from "hono";

// ---------- Security Headers ----------

/** Options for the securityHeaders middleware. */
export interface SecurityHeadersOptions {
  /** X-Frame-Options value. Default: "DENY". Set to false to omit. */
  frameOptions?: string | false;
  /** X-Content-Type-Options value. Default: "nosniff". Set to false to omit. */
  contentTypeOptions?: string | false;
  /** Referrer-Policy value. Default: "strict-origin-when-cross-origin". Set to false to omit. */
  referrerPolicy?: string | false;
  /** Permissions-Policy value. Default: restrictive policy. Set to false to omit. */
  permissionsPolicy?: string | false;
  /** X-XSS-Protection value. Default: "0" (disable browser XSS filter, rely on CSP). */
  xssProtection?: string | false;
  /** Strict-Transport-Security value. Default: "max-age=31536000; includeSubDomains". Set to false to omit. */
  hsts?: string | false;
}

const DEFAULT_PERMISSIONS_POLICY =
  "camera=(), microphone=(), geolocation=(), payment=()";

/**
 * Common security headers middleware.
 *
 * Sets safe defaults for X-Frame-Options, X-Content-Type-Options,
 * Referrer-Policy, Permissions-Policy, X-XSS-Protection, and HSTS.
 * Each header can be individually customized or disabled.
 */
export function securityHeaders(
  options: SecurityHeadersOptions = {},
): MiddlewareHandler {
  const {
    frameOptions = "DENY",
    contentTypeOptions = "nosniff",
    referrerPolicy = "strict-origin-when-cross-origin",
    permissionsPolicy = DEFAULT_PERMISSIONS_POLICY,
    xssProtection = "0",
    hsts = "max-age=31536000; includeSubDomains",
  } = options;

  return async (c: Context, next: Next) => {
    await next();
    if (frameOptions !== false) {
      c.header("X-Frame-Options", frameOptions);
    }
    if (contentTypeOptions !== false) {
      c.header("X-Content-Type-Options", contentTypeOptions);
    }
    if (referrerPolicy !== false) {
      c.header("Referrer-Policy", referrerPolicy);
    }
    if (permissionsPolicy !== false) {
      c.header("Permissions-Policy", permissionsPolicy);
    }
    if (xssProtection !== false) {
      c.header("X-XSS-Protection", xssProtection);
    }
    if (hsts !== false) {
      c.header("Strict-Transport-Security", hsts);
    }
  };
}

// ---------- Content Security Policy ----------

/** CSP directive sources. */
export interface CspOptions {
  /** default-src. Default: ["'self'"]. */
  defaultSrc?: string[];
  /** script-src. Default: ["'self'"]. */
  scriptSrc?: string[];
  /** style-src. Default: ["'self'", "'unsafe-inline'"]. */
  styleSrc?: string[];
  /** img-src. Default: ["'self'", "data:"]. */
  imgSrc?: string[];
  /** font-src. Default: ["'self'"]. */
  fontSrc?: string[];
  /** connect-src. Default: ["'self'"]. */
  connectSrc?: string[];
  /** frame-src. Default: ["'none'"]. */
  frameSrc?: string[];
  /** object-src. Default: ["'none'"]. */
  objectSrc?: string[];
  /** base-uri. Default: ["'self'"]. */
  baseUri?: string[];
  /** form-action. Default: ["'self'"]. */
  formAction?: string[];
  /** Report-only mode (no enforcement). Default: false. */
  reportOnly?: boolean;
  /** Additional directives as key-value pairs. */
  additionalDirectives?: Record<string, string[]>;
}

/** Build a CSP header value from options. */
function buildCspValue(options: CspOptions): string {
  const directives: Record<string, string[]> = {
    "default-src": options.defaultSrc ?? ["'self'"],
    "script-src": options.scriptSrc ?? ["'self'"],
    "style-src": options.styleSrc ?? ["'self'", "'unsafe-inline'"],
    "img-src": options.imgSrc ?? ["'self'", "data:"],
    "font-src": options.fontSrc ?? ["'self'"],
    "connect-src": options.connectSrc ?? ["'self'"],
    "frame-src": options.frameSrc ?? ["'none'"],
    "object-src": options.objectSrc ?? ["'none'"],
    "base-uri": options.baseUri ?? ["'self'"],
    "form-action": options.formAction ?? ["'self'"],
    ...options.additionalDirectives,
  };

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(" ")}`)
    .join("; ");
}

/**
 * Content Security Policy middleware.
 *
 * Sets the Content-Security-Policy (or Content-Security-Policy-Report-Only)
 * header with safe defaults. Each directive can be customized.
 *
 * @example
 * ```ts
 * // Allow Supabase and Google Fonts
 * app.use("*", csp({
 *   connectSrc: ["'self'", "https://*.supabase.co"],
 *   fontSrc: ["'self'", "https://fonts.gstatic.com"],
 *   styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
 * }));
 * ```
 */
export function csp(options: CspOptions = {}): MiddlewareHandler {
  const headerName = options.reportOnly
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";
  const value = buildCspValue(options);

  return async (c: Context, next: Next) => {
    await next();
    c.header(headerName, value);
  };
}

// ---------- CSRF Protection ----------

/** Options for CSRF protection. */
export interface CsrfOptions {
  /** Cookie name for the CSRF token. Default: "__csrf". */
  cookieName?: string;
  /** Header name to check. Default: "x-csrf-token". */
  headerName?: string;
  /** HTTP methods to protect. Default: ["POST", "PUT", "PATCH", "DELETE"]. */
  protectedMethods?: string[];
  /** Paths to exclude from CSRF protection (e.g., webhooks). */
  excludePaths?: string[];
  /** Cookie options. */
  cookie?: {
    /** SameSite attribute. Default: "strict". */
    sameSite?: "strict" | "lax" | "none";
    /** Secure flag. Default: true. */
    secure?: boolean;
    /** Path. Default: "/". */
    path?: string;
  };
}

/** Generate a random CSRF token. */
function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Parse cookies from the Cookie header. */
function parseCookies(header: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  for (const pair of header.split(";")) {
    const [key, ...vals] = pair.trim().split("=");
    if (key) cookies[key.trim()] = vals.join("=").trim();
  }
  return cookies;
}

/**
 * CSRF protection middleware using the double-submit cookie pattern.
 *
 * On GET requests, sets a CSRF cookie with a random token.
 * On state-changing requests (POST, PUT, PATCH, DELETE),
 * validates that the request header matches the cookie value.
 *
 * @example
 * ```ts
 * app.use("*", csrfProtection());
 *
 * // On the client, read the cookie and send it as a header:
 * fetch("/api/data", {
 *   method: "POST",
 *   headers: { "x-csrf-token": getCookie("__csrf") },
 * });
 * ```
 */
export function csrfProtection(
  options: CsrfOptions = {},
): MiddlewareHandler {
  const {
    cookieName = "__csrf",
    headerName = "x-csrf-token",
    protectedMethods = ["POST", "PUT", "PATCH", "DELETE"],
    excludePaths = [],
    cookie: cookieOpts = {},
  } = options;

  const {
    sameSite = "strict",
    secure = true,
    path = "/",
  } = cookieOpts;

  return async (c: Context, next: Next) => {
    const method = c.req.method.toUpperCase();

    // Check if path is excluded
    const requestPath = new URL(c.req.url).pathname;
    if (excludePaths.some((p) => requestPath.startsWith(p))) {
      await next();
      return;
    }

    if (protectedMethods.includes(method)) {
      // Validate CSRF token
      const cookieHeader = c.req.header("cookie") ?? "";
      const cookies = parseCookies(cookieHeader);
      const cookieToken = cookies[cookieName];
      const headerToken = c.req.header(headerName);

      if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return c.json({ error: "CSRF token mismatch" }, 403);
      }
    }

    await next();

    // Set CSRF cookie on all responses if not already set
    const cookieHeader = c.req.header("cookie") ?? "";
    const cookies = parseCookies(cookieHeader);
    if (!cookies[cookieName]) {
      const token = generateToken();
      const parts = [
        `${cookieName}=${token}`,
        `Path=${path}`,
        `SameSite=${sameSite.charAt(0).toUpperCase() + sameSite.slice(1)}`,
      ];
      if (secure) parts.push("Secure");
      parts.push("HttpOnly");
      c.header("Set-Cookie", parts.join("; "));
    }
  };
}
