/**
 * Icon component — renders Lucide-derived SVG icons inline.
 *
 * Usage:
 *   <Icon name="search" />
 *   <Icon name="settings" size={24} strokeWidth={1.5} />
 *
 * Icons are stroke-based with a 24x24 viewBox. Color inherits from
 * the parent element via `currentColor`.
 */
import { ICON_PATHS } from "./paths.ts";

/** Props for the Icon component. */
export interface IconProps {
  /** Icon name (e.g. "search", "chevron-down"). See paths.ts for available names. */
  name: string;
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
 * Renders a Lucide-derived SVG icon.
 * Falls back to null if the icon name is not found.
 */
export function Icon({
  name,
  size = 20,
  class: cls,
  strokeWidth = 2,
  "aria-label": ariaLabel,
}: IconProps): any {
  const path = ICON_PATHS[name];
  if (!path) return null;

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
      dangerouslySetInnerHTML={{ __html: path }}
    />
  );
}

/** Returns the raw SVG string for an icon (for use outside JSX). */
export function iconSvg(
  name: string,
  size = 20,
  strokeWidth = 2,
): string {
  const path = ICON_PATHS[name];
  if (!path) return "";
  return `<svg class="ii-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
