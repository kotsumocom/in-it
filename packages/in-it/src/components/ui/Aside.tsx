/**
 * Aside (Callout)   Note, Tip, Caution, Danger
 * Inspired by Starlight, fully self-implemented
 */

export type AsideVariant = "note" | "tip" | "caution" | "danger";

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

export function Aside({ variant = "note", title, children }: AsideProps) {
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
