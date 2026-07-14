/**
 * Aside (Callout) - Note, Tip, Caution, Danger variants
 * Inspired by Starlight, fully self-implemented
 */

/** Aside callout variant: note, tip, caution, or danger. */
import { SECTION_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
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
  injectCSS("ii-section", SECTION_CSS);
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