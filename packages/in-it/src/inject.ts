/**
 * CSS auto-injection utility.
 *
 * Each component calls `injectCSS(id, css)` on first render.
 * The base CSS (variables + reset + animations) is injected
 * automatically before any component CSS.
 *
 * @internal
 */

const injected = new Set<string>();

let baseCSS = "";

/** Register base CSS (called from generated css module) */
export function setBaseCSS(css: string): void {
  baseCSS = css;
}

/**
 * Inject a CSS chunk into the document head.
 * - Base CSS is auto-injected before the first component CSS.
 * - Each `id` is injected only once (idempotent).
 */
export function injectCSS(id: string, css: string): void {
  if (typeof document === "undefined") return;

  // Inject base (variables + reset + animations) on first call
  if (!injected.has("ii-base")) {
    injected.add("ii-base");
    const el = document.createElement("style");
    el.id = "ii-base";
    el.textContent = baseCSS;
    document.head.appendChild(el);
  }

  if (injected.has(id)) return;
  injected.add(id);
  const el = document.createElement("style");
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}
