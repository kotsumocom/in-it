
import { injectCSS } from "../../inject.ts";
import { Icon } from "../../icons/Icon.tsx";

/** @internal CSS for EmptyState — co-located for self-containment. */
export const EMPTY_STATE_CSS = `/* --- Empty State --- */
.ii-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}
.ii-empty__icon { font-size: 3rem; margin-bottom: 16px; }
.ii-empty__title {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  margin-bottom: 8px;
}
.ii-empty__desc {
  color: var(--ii-on-surface-variant);
  max-width: 360px;
}
`;

/** Props for the {@link EmptyState} component.
 * @property icon - Emoji or icon string displayed above the title.
 * @property title - Heading text.
 * @property description - Optional body text below the title.
 * @property children - Optional action elements (e.g., a button).
 */
export interface EmptyStateProps {
  icon?: string | any;
  title: string;
  description?: string;
  children?: any;
}

/** Centered placeholder for empty lists or search results, with icon, title, description, and optional actions. */
export function EmptyState({ icon = "", title, description, children }: EmptyStateProps): any {
  injectCSS("ii-empty", EMPTY_STATE_CSS);
  return (
    <div class="ii-empty">
      <div class="ii-empty__icon">{typeof icon === "string" ? <Icon name={icon} size={48} /> : icon}</div>
      <h3 class="ii-empty__title">{title}</h3>
      {description && <p class="ii-empty__desc">{description}</p>}
      {children}
    </div>
  );
}
