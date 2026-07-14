import { injectCSS } from "../../inject.ts";

/** @internal CSS for Badge — co-located for self-containment. */
export const BADGE_CSS = `/* --- Badge --- */
.ii-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 100px;
  font-size: var(--ii-font-sm);
  font-weight: 500;
  line-height: 1.5;
}
.ii-badge--success { background: color-mix(in srgb, var(--ii-success) 12%, transparent); color: var(--ii-success); }
.ii-badge--error { background: color-mix(in srgb, var(--ii-error) 12%, transparent); color: var(--ii-error); }
.ii-badge--warning { background: color-mix(in srgb, var(--ii-warning) 12%, transparent); color: var(--ii-warning); }
.ii-badge--info { background: color-mix(in srgb, var(--ii-info) 12%, transparent); color: var(--ii-info); }
.ii-badge--neutral { background: var(--ii-surface-container-high); color: var(--ii-on-surface-variant); }
`;

/** Props for the {@link Badge} component.
 * @property variant - Visual style: success, error, warning, info, or neutral (default).
 * @property children - Badge content.
 */
export interface BadgeProps {
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  children: any;
}

/** Small inline status label rendered as a `<span>` with color-coded variants. */
export function Badge({ variant = "neutral", children }: BadgeProps): any {
  injectCSS("ii-badge", BADGE_CSS);
  return (
    <span class={`ii-badge ii-badge--${variant}`}>
      {children}
    </span>
  );
}
