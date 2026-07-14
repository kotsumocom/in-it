/**
 * Aside (Callout) - Note, Tip, Caution, Danger variants
 * Inspired by Starlight, fully self-implemented
 */

import { injectCSS } from "../../inject.ts";


/** @internal CSS for Aside callout — co-located for self-containment. */
export const ASIDE_CSS = `/* --- Aside / Callout --- */
.ii-aside { padding: 16px; border-radius: var(--ii-shape-md); margin-bottom: 24px; border-left: 4px solid; }
.ii-aside__title { font-weight: 600; font-size: var(--ii-font-sm); margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.ii-aside__body { font-size: var(--ii-font-sm); line-height: 1.6; }
.ii-aside--note { border-left-color: var(--ii-info); background: color-mix(in srgb, var(--ii-info) 6%, var(--ii-surface)); }
.ii-aside--tip { border-left-color: var(--ii-success); background: color-mix(in srgb, var(--ii-success) 6%, var(--ii-surface)); }
.ii-aside--caution { border-left-color: var(--ii-warning); background: color-mix(in srgb, var(--ii-warning) 6%, var(--ii-surface)); }
.ii-aside--danger { border-left-color: var(--ii-error); background: color-mix(in srgb, var(--ii-error) 6%, var(--ii-surface)); }
`;

/** Aside callout variant: note, tip, caution, or danger. */
export type AsideVariant = "note" | "tip" | "caution" | "danger";

/** Props for the Aside callout component. */
export interface AsideProps {
  variant?: AsideVariant;
  title?: string;
  children: any;
}

const ICONS: Record<AsideVariant, string> = {
  note: "",
  tip: "💡",
  caution: "⚠️",
  danger: "🚨",
};

const TITLES: Record<AsideVariant, string> = {
  note: "Note",
  tip: "Tip",
  caution: "Caution",
  danger: "Danger",
};

/** Styled callout block for notes, tips, cautions, and danger warnings. */
export function Aside({ variant = "note", title, children }: AsideProps): any {
  injectCSS("ii-aside", ASIDE_CSS);
  return (
    <div class={`ii-aside ii-aside--${variant}`} role="note">
      <div class="ii-aside__title">
        <span>{ICONS[variant]}</span>
        <span>{title ?? TITLES[variant]}</span>
      </div>
      <div class="ii-aside__body">{children}</div>
    </div>
  );
}