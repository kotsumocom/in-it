/**
 * Landing Page components
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for Landing Page — co-located for self-containment. */
export const LANDING_CSS = `/* --- Landing Page Layout --- */
.ii-lp-header {
  position: sticky; top: 0; z-index: 50;
  background: color-mix(in srgb, var(--ii-surface) 85%, transparent);
  backdrop-filter: blur(12px); border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-lp-header__inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; }
.ii-lp-header__brand { font-weight: 700; font-size: 1.25rem; letter-spacing: -0.02em; text-decoration: none; color: var(--ii-on-surface); }
.ii-lp-header__nav { display: flex; align-items: center; gap: 24px; }
.ii-lp-header__nav a { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); text-decoration: none; transition: color var(--ii-transition); }
.ii-lp-header__nav a:hover { color: var(--ii-primary); }

.ii-lp-hero { text-align: center; padding: 80px 24px 64px; }
.ii-lp-hero__inner { max-width: 800px; margin: 0 auto; }
.ii-lp-hero__badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: var(--ii-font-sm); font-weight: 500; background: var(--ii-primary-container); color: var(--ii-on-primary-container); margin-bottom: 24px; }
.ii-lp-hero__headline { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; color: var(--ii-on-surface); }
.ii-lp-hero__subhead { font-size: 1.125rem; line-height: 1.6; color: var(--ii-on-surface-variant); max-width: 600px; margin: 0 auto 32px; }
.ii-lp-hero__actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.ii-lp-hero__install { display: inline-flex; align-items: center; gap: 12px; padding: 10px 20px; background: var(--ii-surface-container); border-radius: var(--ii-shape-md); font-family: monospace; font-size: var(--ii-font-sm); color: var(--ii-on-surface); margin-top: 24px; }

.ii-lp-features { padding: 64px 24px; }
.ii-lp-features__inner { max-width: 1200px; margin: 0 auto; }
.ii-lp-features__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
.ii-lp-features__card { padding: 32px; border-radius: var(--ii-shape-lg); border: 1px solid var(--ii-outline-variant); background: var(--ii-surface); }
.ii-lp-features__card-icon { font-size: 2rem; margin-bottom: 16px; }
.ii-lp-features__card-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 8px; }
.ii-lp-features__card-desc { font-size: var(--ii-font-base); color: var(--ii-on-surface-variant); line-height: 1.6; }

.ii-lp-section { padding: 64px 24px; }
.ii-lp-section__inner { max-width: 1200px; margin: 0 auto; }
.ii-lp-section__title { font-size: 1.75rem; font-weight: 700; text-align: center; margin-bottom: 32px; }
.ii-lp-section__subtitle { font-size: var(--ii-font-base); color: var(--ii-on-surface-variant); text-align: center; margin-top: -24px; margin-bottom: 32px; }

.ii-lp-footer { padding: 32px 24px; border-top: 1px solid var(--ii-outline-variant); text-align: center; }
.ii-lp-footer__inner { max-width: 1200px; margin: 0 auto; font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-lp-footer a { color: var(--ii-primary); text-decoration: none; }

/* Component grid for LP */
.ii-component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.ii-component-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; border-radius: var(--ii-shape-md); border: 1px solid var(--ii-outline-variant); background: var(--ii-surface); text-align: center; transition: all var(--ii-transition); }
.ii-component-card:hover { border-color: var(--ii-primary); box-shadow: var(--ii-shadow-sm); }
.ii-component-card__icon { font-size: 1.5rem; }
.ii-component-card__name { font-size: var(--ii-font-sm); font-weight: 500; }
.ii-component-card__tag { font-size: 0.625rem; padding: 1px 6px; border-radius: 4px; background: var(--ii-surface-container-high); color: var(--ii-on-surface-variant); }
`;

// --- LandingHeader ---
/** Props for the LandingHeader component. */
export interface LandingHeaderProps {
  brand: string;
  brandHref?: string;
  navLinks?: { href: string; label: string }[];
  themeToggle?: any;
}

/** Landing page top navigation bar with brand and nav links. */
export function LandingHeader({ brand, brandHref = "/", navLinks = [], themeToggle }: LandingHeaderProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  return (
    <header class="ii-lp-header">
      <div class="ii-lp-header__inner">
        <a href={brandHref} class="ii-lp-header__brand">{brand}</a>
        <nav class="ii-lp-header__nav">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          {themeToggle}
        </nav>
      </div>
    </header>
  );
}

// --- LandingHero ---
/** Props for the LandingHero component. */
export interface LandingHeroProps {
  badge?: string;
  headline: string;
  subhead: string;
  actions?: any;
  install?: string;
}

/** Landing page hero section with headline, subhead, and call-to-action. */
export function LandingHero({ badge, headline, subhead, actions, install }: LandingHeroProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  return (
    <section class="ii-lp-hero">
      <div class="ii-lp-hero__inner">
        {badge && <span class="ii-lp-hero__badge">{badge}</span>}
        <h1 class="ii-lp-hero__headline">{headline}</h1>
        <p class="ii-lp-hero__subhead">{subhead}</p>
        {actions && <div class="ii-lp-hero__actions">{actions}</div>}
        {install && <div class="ii-lp-hero__install"><code>{install}</code></div>}
      </div>
    </section>
  );
}

// --- LandingFeatures ---
/** A single feature card with icon, title, and description. */
export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

/** Props for the LandingFeatures component. */
export interface LandingFeaturesProps {
  features: FeatureCard[];
}

/** Grid of feature cards for the landing page. */
export function LandingFeatures({ features }: LandingFeaturesProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  return (
    <section class="ii-lp-features">
      <div class="ii-lp-features__inner">
        <div class="ii-lp-features__grid">
          {features.map((f, i) => (
            <div key={i} class="ii-lp-features__card">
              <div class="ii-lp-features__card-icon">{f.icon}</div>
              <h3 class="ii-lp-features__card-title">{f.title}</h3>
              <p class="ii-lp-features__card-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- LandingSection ---
/** Props for the LandingSection component. */
export interface LandingSectionProps {
  title?: string;
  subtitle?: string;
  children: any;
}

/** Generic content section for the landing page. */
export function LandingSection({ title, subtitle, children }: LandingSectionProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  return (
    <section class="ii-lp-section">
      <div class="ii-lp-section__inner">
        {title && <h2 class="ii-lp-section__title">{title}</h2>}
        {subtitle && <p class="ii-lp-section__subtitle">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

// --- LandingFooter ---
/** Props for the LandingFooter component. */
export interface LandingFooterProps {
  children: any;
}

/** Landing page footer with custom content. */
export function LandingFooter({ children }: LandingFooterProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  return (
    <footer class="ii-lp-footer">
      <div class="ii-lp-footer__inner">{children}</div>
    </footer>
  );
}