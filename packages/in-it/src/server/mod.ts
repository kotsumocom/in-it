/**
 * @module server
 * Server-side utilities for in-it apps.
 *
 * These are Hono-specific helpers for building server-rendered apps.
 * They complement the client-side components with server-side routing,
 * layout nesting, and context management.
 *
 * @example
 * ```ts
 * import { withLayout, routeGroup, contextProvider } from "@kotsumo/in-it/server";
 * ```
 */

export { withLayout, contextProvider, routeGroup } from "./layout.ts";
export type { LayoutComponent } from "./layout.ts";

// Security
export { securityHeaders, csp, csrfProtection } from "./security.ts";
export type {
  SecurityHeadersOptions,
  CspOptions,
  CsrfOptions,
} from "./security.ts";

// Environment
export { assertEnv } from "./env.ts";
