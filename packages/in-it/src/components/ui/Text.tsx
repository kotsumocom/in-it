/**
 * Text — Typography utility component
 * Replaces repetitive inline styles for text color, size, weight, and alignment.
 * Eliminates patterns like `color: var(--ii-on-surface-variant)` / `fontWeight: 500`.
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for Text — co-located for self-containment. */
export const TEXT_CSS = `/* --- Text --- */
.ii-text { margin: 0; }
.ii-text--sm { font-size: var(--ii-body-sm); }
.ii-text--base { font-size: var(--ii-body-md); }
.ii-text--lg { font-size: var(--ii-body-lg); }
.ii-text--xl { font-size: var(--ii-title-lg); }
.ii-text--normal { font-weight: 400; }
.ii-text--medium { font-weight: 500; }
.ii-text--bold { font-weight: 700; }
.ii-text--muted { color: var(--ii-on-surface-variant); }
.ii-text--left { text-align: left; }
.ii-text--center { text-align: center; }
.ii-text--right { text-align: right; }
.ii-text--truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

/** Text size variants. */
export type TextSize = "sm" | "base" | "lg" | "xl";

/** Text weight variants. */
export type TextWeight = "normal" | "medium" | "bold";

/** Text alignment options. */
export type TextAlign = "left" | "center" | "right";

/** Props for the Text component. */
export interface TextProps {
  /** Font size. @default "base" */
  size?: TextSize;
  /** Font weight. @default "normal" */
  weight?: TextWeight;
  /** Use muted color (on-surface-variant). @default false */
  muted?: boolean;
  /** Text alignment. */
  align?: TextAlign;
  /** HTML element tag. @default "span" */
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "small" | "strong";
  /** Truncate with ellipsis. @default false */
  truncate?: boolean;
  children: any;
}

/**
 * Typography utility for consistent text styling.
 *
 * @example
 * ```tsx
 * <Text size="sm" muted>Last updated: 2024-01-01</Text>
 * <Text size="lg" weight="bold">Total: ¥1,234,567</Text>
 * <Text as="p" muted>説明テキスト</Text>
 * ```
 */
export function Text({
  size = "base",
  weight = "normal",
  muted = false,
  align,
  as = "span",
  truncate = false,
  children,
}: TextProps): any {
  injectCSS("ii-text", TEXT_CSS);
  const classes = [
    "ii-text",
    `ii-text--${size}`,
    `ii-text--${weight}`,
    muted && "ii-text--muted",
    align && `ii-text--${align}`,
    truncate && "ii-text--truncate",
  ].filter(Boolean).join(" ");
  if (as === "p") return <p class={classes}>{children}</p>;
  if (as === "div") return <div class={classes}>{children}</div>;
  if (as === "h1") return <h1 class={classes}>{children}</h1>;
  if (as === "h2") return <h2 class={classes}>{children}</h2>;
  if (as === "h3") return <h3 class={classes}>{children}</h3>;
  if (as === "h4") return <h4 class={classes}>{children}</h4>;
  if (as === "h5") return <h5 class={classes}>{children}</h5>;
  if (as === "h6") return <h6 class={classes}>{children}</h6>;
  if (as === "label") return <label class={classes}>{children}</label>;
  if (as === "small") return <small class={classes}>{children}</small>;
  if (as === "strong") return <strong class={classes}>{children}</strong>;
  return <span class={classes}>{children}</span>;
}
