/**
 * Landing Page components
 */

// --- LandingHeader ---
/** Props for the LandingHeader component. */
import { LANDING_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
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
  return (
    <footer class="ii-lp-footer">
      <div class="ii-lp-footer__inner">{children}</div>
    </footer>
  );
}