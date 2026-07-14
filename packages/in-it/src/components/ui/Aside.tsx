/**
 * Aside (Callout) - Note, Tip, Caution, Danger variants
 * Inspired by Starlight, fully self-implemented
 */

/** @internal CSS for Aside and Section — co-located for self-containment. */
export const SECTION_CSS = `/* --- Section --- */
.ii-section {
  margin-top: var(--ii-spacing-6);
}
.ii-section__title {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  margin-bottom: var(--ii-spacing-4);
}
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