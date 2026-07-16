/**
 * @module security
 * Client-side and universal security utilities.
 *
 * Provides input sanitization helpers that work on both
 * client and server. These complement (but do NOT replace)
 * server-side validation.
 *
 * @example
 * ```ts
 * import { escapeHtml, sanitizeInput, sanitizeUrl } from "@kotsumo/in-it/security";
 * ```
 */

export { escapeHtml, sanitizeInput, sanitizeUrl } from "./sanitize.ts";
