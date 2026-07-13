/**
 * Icon component — renders Tabler-derived SVG icons inline.
 *
 * Usage:
 *   // By name (loads full icon set):
 *   <Icon name="search" />
 *   <Icon name="settings" size={24} strokeWidth={1.5} />
 *
 *   // By path (tree-shakeable):
 *   import { search } from "@kotsumo/in-it/icons/individual";
 *   <Icon path={search} />
 *
 * Icons are stroke-based with a 24x24 viewBox. Color inherits from
 * the parent element via `currentColor`.
 */
import { ICON_PATHS } from "./paths.ts";

/** Props for the Icon component. */
export interface IconProps {
  /** Icon name (e.g. "search", "chevron-down"). Looks up from the full icon set. */
  name?: string;
  /** Raw SVG inner HTML. Use with tree-shakeable individual imports. Takes priority over `name`. */
  path?: string;
  /** Icon size in pixels. Defaults to 20. */
  size?: number;
  /** CSS class to apply to the SVG element. */
  class?: string;
  /** Stroke width. Defaults to 2. */
  strokeWidth?: number;
  /** Accessible label. When set, role="img" is applied. */
  "aria-label"?: string;
}

/**
 * Renders a Tabler-derived SVG icon.
 * Falls back to null if no icon is resolved.
 */
export function Icon({
  name,
  path: pathData,
  size = 20,
  class: cls,
  strokeWidth = 2,
  "aria-label": ariaLabel,
}: IconProps): any {
  const resolved = pathData ?? (name ? ICON_PATHS[name] : undefined);
  if (!resolved) return null;

  return (
    <svg
      class={`ii-icon${cls ? ` ${cls}` : ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-linejoin="round"
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : "true"}
      dangerouslySetInnerHTML={{ __html: resolved }}
    />
  );
}

/** Returns the raw SVG string for an icon (for use outside JSX). */
export function iconSvg(
  nameOrPath: string,
  size = 20,
  strokeWidth = 2,
): string {
  // If it starts with '<', treat as raw path data; otherwise look up by name
  const resolved = nameOrPath.startsWith("<") ? nameOrPath : ICON_PATHS[nameOrPath];
  if (!resolved) return "";
  return `<svg class="ii-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${resolved}</svg>`;
}
