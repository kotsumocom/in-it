
import { injectCSS } from "../../inject.ts";

/** @internal CSS for StatCard — co-located for self-containment. */
export const STAT_CARD_CSS = `/* --- Stat Card --- */
.ii-stat-card {
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  padding: var(--ii-spacing-5);
}
.ii-stat-card__label {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-stat-card__value {
  font-size: var(--ii-font-2xl);
  font-weight: 700;
  margin-top: var(--ii-spacing-1);
}
.ii-stat-card__trend {
  font-size: var(--ii-font-sm);
  margin-top: var(--ii-spacing-1);
}
.ii-stat-card__trend--up { color: var(--ii-success); }
.ii-stat-card__trend--down { color: var(--ii-error); }

/* --- Stats Grid --- */
.ii-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--ii-spacing-4);
}
`;

/** Props for the {@link StatCard} component.
 * @property label - Metric name displayed above the value.
 * @property value - The main numeric or text value.
 * @property trend - Optional trend text (e.g., "+12%").
 * @property trendUp - If true, styles trend as positive; otherwise negative.
 */
export interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

/** Dashboard metric card displaying a label, value, and optional up/down trend indicator. */
export function StatCard({ label, value, trend, trendUp }: StatCardProps): any {
  injectCSS("ii-stat-card", STAT_CARD_CSS);
  return (
    <div class="ii-stat-card">
      <div class="ii-stat-card__label">{label}</div>
      <div class="ii-stat-card__value">{value}</div>
      {trend && (
        <div class={`ii-stat-card__trend${trendUp ? " ii-stat-card__trend--up" : " ii-stat-card__trend--down"}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
