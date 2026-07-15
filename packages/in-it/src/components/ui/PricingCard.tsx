/**
 * PricingCard — Pricing plan card for landing pages.
 *
 * Usage:
 *   <PricingCard
 *     name="Pro"
 *     price="$29"
 *     period="/month"
 *     features={["10 projects", "Unlimited users", "Priority support"]}
 *     cta="Get Started"
 *     highlighted
 *   />
 */

import { useLabels } from "../../locale.ts";
import type { LocaleStrings } from "../../locale.ts";
import { Button } from "./mod.tsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for PricingCard — co-located for self-containment. */
export const PRICING_CARD_CSS = `/* --- PricingCard --- */
.ii-pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--ii-spacing-6);
  max-width: 1000px;
  margin: 0 auto;
}
.ii-pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--ii-spacing-6);
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  transition: box-shadow var(--ii-transition), border-color var(--ii-transition);
}
.ii-pricing-card:hover {
  box-shadow: var(--ii-shadow-md);
}
.ii-pricing-card--highlighted {
  border-color: var(--ii-primary);
  box-shadow: var(--ii-shadow-md);
}
.ii-pricing-card__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 16px;
  background: var(--ii-primary);
  color: var(--ii-on-primary);
  font-size: var(--ii-font-sm);
  font-weight: 600;
  border-radius: 999px;
  white-space: nowrap;
}
.ii-pricing-card__name {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
  margin: 0 0 var(--ii-spacing-2);
}
.ii-pricing-card__price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: var(--ii-spacing-2);
}
.ii-pricing-card__amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--ii-on-surface);
  line-height: 1;
}
.ii-pricing-card__period {
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
}
.ii-pricing-card__desc {
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
  margin: 0 0 var(--ii-spacing-4);
}
.ii-pricing-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--ii-spacing-6);
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-2);
  flex: 1;
}
.ii-pricing-card__feature {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
}
.ii-pricing-card__feature .ii-icon {
  color: var(--ii-success);
  flex-shrink: 0;
}
`;

/** Props for PricingCard. */
export interface PricingCardProps {
  /** Plan name (e.g. "Free", "Pro", "Enterprise"). */
  name: string;
  /** Price display (e.g. "$29", "Custom"). */
  price: string;
  /** Billing period (e.g. "/month", "/year"). */
  period?: string;
  /** Description line below the price. */
  description?: string;
  /** List of features included in this plan. */
  features: string[];
  /** Call-to-action button text. */
  cta?: string;
  /** Callback when CTA is clicked. */
  onCtaClick?: () => void;
  /** Highlight this card (e.g. "Most Popular"). */
  highlighted?: boolean;
  /** Badge text for highlighted plans (e.g. "Most Popular"). */
  badge?: string;
  /** Additional CSS class. */
  class?: string;
  /** Override built-in locale strings. */
  labels?: Partial<Pick<LocaleStrings, "getStarted">>;
}

/** Pricing plan card with features list and CTA button. */
export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  onCtaClick,
  highlighted,
  badge,
  class: cls,
  labels: labelOverrides,
}: PricingCardProps): any {
  injectCSS("ii-pricing-card", PRICING_CARD_CSS);
  const l = useLabels(["getStarted"] as const, labelOverrides);
  return (
    <div class={`ii-pricing-card${highlighted ? " ii-pricing-card--highlighted" : ""}${cls ? ` ${cls}` : ""}`}>
      {badge && <span class="ii-pricing-card__badge">{badge}</span>}
      <h3 class="ii-pricing-card__name">{name}</h3>
      <div class="ii-pricing-card__price">
        <span class="ii-pricing-card__amount">{price}</span>
        {period && <span class="ii-pricing-card__period">{period}</span>}
      </div>
      {description && <p class="ii-pricing-card__desc">{description}</p>}
      <ul class="ii-pricing-card__features">
        {features.map((f, i) => (
          <li key={i} class="ii-pricing-card__feature">
            <svg class="ii-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5l10 -10" /></svg>
            {f}
          </li>
        ))}
      </ul>
      <Button variant={highlighted ? "filled" : "outlined"} onClick={onCtaClick}>
        {cta ?? l.getStarted}
      </Button>
    </div>
  );
}
