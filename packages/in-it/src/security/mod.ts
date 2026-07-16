/**
 * @module security
 * Client-side and universal security utilities.
 *
 * Provides input sanitization helpers and form validation
 * that work on both client and server. These complement
 * (but do NOT replace) server-side validation.
 *
 * @example
 * ```ts
 * import { escapeHtml, sanitizeInput, sanitizeUrl, createFormValidator } from "@kotsumo/in-it/security";
 * ```
 */

export { escapeHtml, sanitizeInput, sanitizeUrl } from "./sanitize.ts";
export { createFormValidator } from "./validate.ts";
export type {
  ValidationRule,
  ValidationRules,
  ValidationErrors,
  FormValidator,
} from "./validate.ts";
