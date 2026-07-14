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

/** Props for PricingCard. */
import { PRICING_CARD_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
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
}

/** Pricing plan card with features list and CTA button. */
export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta = "Get Started",
  onCtaClick,
  highlighted,
  badge,
  class: cls,
}: PricingCardProps): any {
  injectCSS("ii-pricing", PRICING_CARD_CSS);
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
      <button
        type="button"
        class={`ii-btn${highlighted ? " ii-btn--filled" : " ii-btn--outlined"}`}
        onClick={onCtaClick}
      >
        {cta}
      </button>
    </div>
  );
}
