import { injectCSS } from "../../inject.ts";

/** @internal CSS for Divider — co-located for self-containment. */
export const DIVIDER_CSS = `/* --- Divider --- */
.ii-divider { border: none; border-top: 1px solid var(--ii-outline-variant); margin: var(--ii-spacing-4) 0; }
.ii-divider--vertical { border-top: none; border-left: 1px solid var(--ii-outline-variant); margin: 0 var(--ii-spacing-4); height: auto; align-self: stretch; }
`;

/** Props for the Divider component. */
export interface DividerProps {
  label?: string;
}

/** Horizontal rule divider with optional label. */
export function Divider({ label }: DividerProps): any {
  injectCSS("ii-divider", DIVIDER_CSS);
  if (label) {
    return <div class="ii-divider ii-divider--label"><span>{label}</span></div>;
  }
  return <hr class="ii-divider" />;
}
