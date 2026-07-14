/**
 * @module inject
 * Lightweight per-component CSS injection helper.
 *
 * Each component calls `injectCSS(id, css)` at render time.
 * CSS is only injected once per id (idempotent).
 * Base CSS (variables, reset, icon, animations) is auto-injected
 * on first call.
 * No-ops in SSR (no `document`).
 */

import { BASE_CSS } from "./base-css.ts";

const injected = new Set<string>();

/**
 * Inject a component's CSS into the document head.
 * Safe to call multiple times — each id is only injected once.
 * Base CSS is automatically injected before the first component CSS.
 * No-op when `document` is not available (SSR).
 */
export function injectCSS(id: string, css: string): void {
  if (typeof document === "undefined") return;
  // Auto-inject base CSS on first call
  if (injected.size === 0) {
    const base = document.createElement("style");
    base.setAttribute("data-ii", "base");
    base.textContent = BASE_CSS;
    document.head.appendChild(base);
  }
  if (injected.has(id)) return;
  injected.add(id);
  const style = document.createElement("style");
  style.setAttribute("data-ii", id);
  style.textContent = css;
  document.head.appendChild(style);
}
