import { injectCSS } from "../../inject.ts";

/** @internal CSS for Card — co-located for self-containment. */
export const CARD_CSS = `/* --- Card --- */
.ii-card {
  background: var(--ii-surface);
  border-radius: var(--ii-shape-md);
  padding: var(--ii-spacing-5);
}
.ii-card--outlined {
  border: 1px solid var(--ii-outline-variant);
}
`;

/** Props for the {@link Card} component.
 * @property outlined - If true, uses a border instead of elevation.
 * @property class - Additional CSS class names.
 */
export interface CardProps {
  outlined?: boolean;
  children: any;
  class?: string;
}

/** Surface container for grouping related content. Supports filled (default) and outlined styles. */
export function Card({ outlined = false, children, class: cls }: CardProps): any {
  injectCSS("ii-card", CARD_CSS);
  return (
    <div class={`ii-card${outlined ? " ii-card--outlined" : ""}${cls ? ` ${cls}` : ""}`}>
      {children}
    </div>
  );
}
