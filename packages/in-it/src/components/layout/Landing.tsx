/**
 * Landing Page コンポーネント群
 */

// --- LandingHeader ---
export interface LandingHeaderProps {
  brand: string;
  brandHref?: string;
  navLinks?: { href: string; label: string }[];
  themeToggle?: any;
}

export function LandingHeader({ brand, brandHref = "/", navLinks = [], themeToggle }: LandingHeaderProps) {
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
export interface LandingHeroProps {
  badge?: string;
  headline: string;
  subhead: string;
  actions?: any;
  install?: string;
}

export function LandingHero({ badge, headline, subhead, actions, install }: LandingHeroProps) {
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
export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export interface LandingFeaturesProps {
  features: FeatureCard[];
}

export function LandingFeatures({ features }: LandingFeaturesProps) {
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
export interface LandingSectionProps {
  title?: string;
  subtitle?: string;
  children: any;
}

export function LandingSection({ title, subtitle, children }: LandingSectionProps) {
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
export interface LandingFooterProps {
  children: any;
}

export function LandingFooter({ children }: LandingFooterProps) {
  return (
    <footer class="ii-lp-footer">
      <div class="ii-lp-footer__inner">{children}</div>
    </footer>
  );
}
