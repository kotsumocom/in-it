/**
 * Landing Page components
 *
 * Flexible building blocks for SaaS landing pages.
 * All components use ii-lp-* CSS classes and inject styles automatically.
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
.ii-lp-header__brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 1.25rem; letter-spacing: -0.02em; text-decoration: none; color: var(--ii-on-surface); }
.ii-lp-header__nav { display: flex; align-items: center; gap: 24px; }
.ii-lp-header__nav a { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); text-decoration: none; transition: color var(--ii-transition); }
.ii-lp-header__nav a:hover { color: var(--ii-primary); }

.ii-lp-hero { text-align: center; padding: 80px 24px 64px; position: relative; overflow: hidden; }
.ii-lp-hero--gradient {
  background: linear-gradient(135deg, var(--ii-primary-container) 0%, var(--ii-surface) 50%, var(--ii-tertiary-container) 100%);
}
.ii-lp-hero__inner { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
.ii-lp-hero__logo { display: flex; justify-content: center; margin-bottom: 16px; }
.ii-lp-hero__logo img { height: 48px; }
.ii-lp-hero__badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: var(--ii-font-sm); font-weight: 500; background: var(--ii-primary-container); color: var(--ii-on-primary-container); margin-bottom: 24px; }
.ii-lp-hero__headline { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; color: var(--ii-on-surface); }
.ii-lp-hero__subhead { font-size: 1.125rem; line-height: 1.6; color: var(--ii-on-surface-variant); max-width: 600px; margin: 0 auto 32px; }
.ii-lp-hero__actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.ii-lp-hero__install { display: inline-flex; align-items: center; gap: 12px; padding: 10px 20px; background: var(--ii-surface-container); border-radius: var(--ii-shape-md); font-family: monospace; font-size: var(--ii-font-sm); color: var(--ii-on-surface); margin-top: 24px; cursor: pointer; border: none; transition: background var(--ii-transition); }
.ii-lp-hero__install:hover { background: var(--ii-surface-container-high); }
.ii-lp-hero__install-hint { font-size: 0.75rem; color: var(--ii-on-surface-variant); margin-left: 8px; }
.ii-lp-hero__content { margin-bottom: 28px; }

.ii-lp-orb { position: absolute; border-radius: 50%; opacity: 0.05; filter: blur(80px); pointer-events: none; }
.ii-lp-orb--primary { top: -100px; left: -100px; width: 400px; height: 400px; background: var(--ii-primary); }
.ii-lp-orb--tertiary { bottom: -100px; right: -100px; width: 350px; height: 350px; background: var(--ii-tertiary); }

.ii-lp-features { padding: 64px 24px; }
.ii-lp-features__inner { max-width: 1200px; margin: 0 auto; }
.ii-lp-features__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; }
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

.ii-lp-code {
  max-width: 560px; margin: 0 auto;
  background: var(--ii-surface-container);
  border: 1px solid var(--ii-outline-variant);
  border-radius: 12px; padding: 20px 24px;
  font-family: "Fira Code", "Cascadia Code", monospace;
  font-size: 0.85rem; line-height: 1.7;
  text-align: left; overflow: auto;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}
.ii-lp-code__line { color: var(--ii-on-surface-variant); }
.ii-lp-code__line + .ii-lp-code__line { margin-top: 0; }
.ii-lp-code__keyword { color: var(--ii-primary); }
.ii-lp-code__component { color: var(--ii-tertiary); }
.ii-lp-code__string { color: var(--ii-secondary); }
.ii-lp-code__comment { color: var(--ii-on-surface-variant); opacity: 0.6; font-style: italic; }

.ii-lp-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 24px; }
.ii-lp-showcase-card {
  padding: 24px; text-decoration: none; color: inherit;
  transition: transform 0.15s, box-shadow 0.15s;
  display: flex; flex-direction: column; gap: 8px;
  border-radius: var(--ii-shape-lg); border: 1px solid var(--ii-outline-variant); background: var(--ii-surface);
}
.ii-lp-showcase-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.ii-lp-showcase-card__title { font-size: 1.05rem; font-weight: 600; margin: 0; }
.ii-lp-showcase-card__desc { font-size: 0.85rem; color: var(--ii-on-surface-variant); margin: 0; line-height: 1.5; }
.ii-lp-showcase-card__tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: auto; padding-top: 8px; }

.ii-component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.ii-component-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 8px; border-radius: var(--ii-shape-md); border: 1px solid var(--ii-outline-variant); background: var(--ii-surface); text-align: center; transition: all var(--ii-transition); }
.ii-component-card:hover { border-color: var(--ii-primary); box-shadow: var(--ii-shadow-sm); }
.ii-component-card__icon { font-size: 1.5rem; }
.ii-component-card__name { font-size: var(--ii-font-sm); font-weight: 500; }
.ii-component-card__tag { font-size: 0.6875rem; padding: 1px 6px; border-radius: 4px; background: var(--ii-surface-container-high); color: var(--ii-on-surface-variant); }
`;

// --- LandingHeader ---
/** Props for the LandingHeader component. */
export interface LandingHeaderProps {
  /** Brand name or JSX (e.g., logo image + text). */
  brand: string | any;
  brandHref?: string;
  navLinks?: { href: string; label: string }[];
  /** Extra elements in the nav area (e.g., ThemeToggle). */
  themeToggle?: any;
  /** Click handler for nav links (SPA navigation). */
  onNavigate?: (href: string) => void;
}

/** Landing page top navigation bar with brand and nav links. */
export function LandingHeader({ brand, brandHref = "/", navLinks = [], themeToggle, onNavigate }: LandingHeaderProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  const handleClick = (href: string) => (e: Event) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };
  return (
    <header class="ii-lp-header">
      <div class="ii-lp-header__inner">
        <a href={brandHref} class="ii-lp-header__brand" onClick={handleClick(brandHref)}>{brand}</a>
        <nav class="ii-lp-header__nav">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={handleClick(link.href)}>{link.label}</a>
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
  /** Optional logo (JSX element or image URL string). */
  logo?: string | any;
  badge?: string;
  headline: string;
  /** Subhead text or JSX for rich content. */
  subhead: string | any;
  /** CTA buttons area. */
  actions?: any;
  /** Install command text. Shows a copyable command block. */
  install?: string;
  /** Called when the install command is copied. */
  onCopy?: () => void;
  /** Hint text next to install (e.g., "Click to copy"). */
  installHint?: any;
  /** Custom content between subhead and actions (e.g., code snippet). */
  children?: any;
  /** Use gradient background variant. */
  gradient?: boolean;
  /** Show decorative background orbs. */
  orbs?: boolean;
}

/** Landing page hero section with headline, subhead, and call-to-action. */
export function LandingHero({
  logo, badge, headline, subhead, actions, install, onCopy, installHint,
  children, gradient, orbs,
}: LandingHeroProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  const heroClass = `ii-lp-hero${gradient ? " ii-lp-hero--gradient" : ""}`;
  return (
    <section class={heroClass}>
      {orbs && (
        <>
          <div class="ii-lp-orb ii-lp-orb--primary" />
          <div class="ii-lp-orb ii-lp-orb--tertiary" />
        </>
      )}
      <div class="ii-lp-hero__inner">
        {logo && (
          <div class="ii-lp-hero__logo">
            {typeof logo === "string" ? <img src={logo} alt="Logo" /> : logo}
          </div>
        )}
        {badge && <span class="ii-lp-hero__badge">{badge}</span>}
        <h1 class="ii-lp-hero__headline">{headline}</h1>
        <p class="ii-lp-hero__subhead">{subhead}</p>
        {children && <div class="ii-lp-hero__content">{children}</div>}
        {actions && <div class="ii-lp-hero__actions">{actions}</div>}
        {install && (
          <div class="ii-lp-hero__install" onClick={onCopy} role="button" tabindex={0}>
            <code>$ {install}</code>
            {installHint && <span class="ii-lp-hero__install-hint">{installHint}</span>}
          </div>
        )}
      </div>
    </section>
  );
}

// --- LandingFeatures ---
/** A single feature card. Icon can be a string, JSX, or any renderable. */
export interface FeatureCard {
  /** Icon: JSX element, string (rendered as text), or number. */
  icon: any;
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

// --- LandingCodeBlock ---
/** A single line in a code block. */
export interface CodeLine {
  /** Array of segments: plain text or tagged spans. */
  segments: (string | { text: string; type: "keyword" | "component" | "string" | "comment" })[];
  /** Extra bottom margin (e.g., for visual grouping). */
  gap?: boolean;
}

/** Props for the LandingCodeBlock component. */
export interface LandingCodeBlockProps {
  /** Lines of code to display. */
  lines: CodeLine[];
}

/** Syntax-highlighted code block for landing pages. */
export function LandingCodeBlock({ lines }: LandingCodeBlockProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  return (
    <div class="ii-lp-code">
      {lines.map((line, i) => (
        <div key={i} class="ii-lp-code__line" style={line.gap ? "margin-bottom: 12px" : undefined}>
          {line.segments.map((seg, j) =>
            typeof seg === "string"
              ? seg
              : <span key={j} class={`ii-lp-code__${seg.type}`}>{seg.text}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// --- LandingShowcaseCard ---
/** Props for the LandingShowcaseCard component. */
export interface LandingShowcaseCardProps {
  /** Card icon (JSX). */
  icon?: any;
  title: string;
  description: string;
  /** Tag/badge labels displayed at the bottom. */
  tags?: string[];
  href?: string;
  onClick?: (e: Event) => void;
}

/** A showcase card for templates, integrations, etc. */
export function LandingShowcaseCard({ icon, title, description, tags, href, onClick }: LandingShowcaseCardProps): any {
  injectCSS("ii-landing", LANDING_CSS);
  const Tag = href ? "a" : "div";
  return (
    <Tag href={href} class="ii-lp-showcase-card" onClick={onClick}>
      {icon && <div>{icon}</div>}
      <h3 class="ii-lp-showcase-card__title">{title}</h3>
      <p class="ii-lp-showcase-card__desc">{description}</p>
      {tags && tags.length > 0 && (
        <div class="ii-lp-showcase-card__tags">
          {tags.map(tag => (
            <span class="ii-badge ii-badge--neutral" style="font-size: 0.6875rem">{tag}</span>
          ))}
        </div>
      )}
    </Tag>
  );
}

// --- LandingCardGrid ---
/** Grid container for LandingShowcaseCards. */
export function LandingCardGrid({ children }: { children: any }): any {
  injectCSS("ii-landing", LANDING_CSS);
  return <div class="ii-lp-card-grid">{children}</div>;
}