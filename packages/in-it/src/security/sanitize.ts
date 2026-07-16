/**
 * @module security/sanitize
 * Input sanitization utilities for XSS prevention.
 *
 * These are simple, zero-dependency helpers that users can apply
 * to sanitize untrusted input. They complement server-side validation
 * but do NOT replace it.
 *
 * @example
 * ```ts
 * import { escapeHtml, sanitizeInput, sanitizeUrl } from "@kotsumo/in-it/security";
 *
 * const safe = escapeHtml(userInput);
 * const cleanInput = sanitizeInput(formValue);
 * const safeLink = sanitizeUrl(userUrl);
 * ```
 */

/**
 * Escape HTML entities to prevent XSS when inserting untrusted
 * strings into HTML context.
 *
 * Escapes: `& < > " '`
 *
 * @example
 * ```ts
 * escapeHtml('<script>alert("xss")</script>');
 * // => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Sanitize user input by escaping HTML entities and stripping
 * control characters (except newline, carriage return, tab).
 *
 * Use this for form input values before storing or displaying.
 *
 * @example
 * ```ts
 * sanitizeInput('Hello <b>world</b>\x00');
 * // => 'Hello &lt;b&gt;world&lt;/b&gt;'
 * ```
 */
export function sanitizeInput(str: string): string {
  // Strip control characters (U+0000-U+001F, U+007F-U+009F) except \n \r \t
  // deno-lint-ignore no-control-regex
  const stripped = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
  return escapeHtml(stripped);
}

/**
 * Sanitize a URL to prevent `javascript:` and `data:` protocol attacks.
 *
 * Returns the URL if safe, or an empty string if the protocol
 * is potentially dangerous.
 *
 * @example
 * ```ts
 * sanitizeUrl('javascript:alert(1)'); // => ''
 * sanitizeUrl('https://example.com'); // => 'https://example.com'
 * sanitizeUrl('/path/to/page');       // => '/path/to/page'
 * ```
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  // Block dangerous protocols
  const lower = trimmed.toLowerCase().replace(/[\s\x00-\x1F]/g, "");
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "";
  }
  return trimmed;
}
