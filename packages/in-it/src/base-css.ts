/**
 * @module base-css
 * Base CSS constants: variables, reset, icon, and animations.
 *
 * These are the foundational styles that must be present before
 * any component CSS is applied.
 */

/** CSS variables: colors, typography, spacing, shadows, etc. */
export const VARIABLES_CSS = `/* --- Variables --- */
:root {
  --ii-primary: #6750a4;
  --ii-primary-container: #eaddff;
  --ii-on-primary: #ffffff;
  --ii-on-primary-container: #21005d;
  --ii-surface: #fef7ff;
  --ii-surface-container: #f3edf7;
  --ii-surface-container-high: #ece6f0;
  --ii-on-surface: #1d1b20;
  --ii-on-surface-variant: #49454f;
  --ii-outline: #79747e;
  --ii-outline-variant: #cac4d0;
  --ii-error: #b3261e;
  --ii-success: #0d652d;
  --ii-info: #0b57d0;
  --ii-warning: #e37400;
  --ii-shape-sm: 8px;
  --ii-shape-md: 12px;
  --ii-shape-lg: 16px;
  --ii-shape-xl: 28px;
  --ii-spacing-1: 4px;
  --ii-spacing-2: 8px;
  --ii-spacing-3: 12px;
  --ii-spacing-4: 16px;
  --ii-spacing-5: 20px;
  --ii-spacing-6: 24px;
  --ii-shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --ii-shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --ii-shadow-lg: 0 8px 24px rgba(0,0,0,0.15);
  --ii-transition: 200ms ease;
  --ii-font-family: 'Inter', 'Noto Sans JP', system-ui, sans-serif;
  /* MD3 Typography Scale */
  --ii-display-lg: 3.5625rem;
  --ii-display-md: 2.8125rem;
  --ii-display-sm: 2.25rem;
  --ii-headline-lg: 2rem;
  --ii-headline-md: 1.75rem;
  --ii-headline-sm: 1.5rem;
  --ii-title-lg: 1.375rem;
  --ii-title-md: 1rem;
  --ii-title-sm: 0.875rem;
  --ii-body-lg: 1rem;
  --ii-body-md: 0.875rem;
  --ii-body-sm: 0.75rem;
  --ii-label-lg: 0.875rem;
  --ii-label-md: 0.75rem;
  --ii-label-sm: 0.6875rem;
  /* Legacy aliases */
  --ii-font-sm: var(--ii-body-sm);
  --ii-font-base: var(--ii-body-md);
  --ii-font-lg: var(--ii-body-lg);
  --ii-font-xl: var(--ii-title-lg);
  --ii-font-2xl: var(--ii-headline-sm);
  color-scheme: light;
}

/* --- CJK Typography Scale Override --- */
:root:lang(ja), :root[lang="ja"] {
  --ii-label-sm: 0.75rem;      /* 11px → 12px */
  --ii-body-sm: 0.8125rem;     /* 12px → 13px */
  --ii-label-md: 0.8125rem;    /* 12px → 13px */
  --ii-body-md: 1rem;          /* 14px → 16px */
}
:root:lang(ja) body, :root[lang="ja"] body {
  line-height: 1.7;
}

/* --- Dark Mode --- */
[data-theme="dark"],
.dark {
  --ii-primary: #d0bcff;
  --ii-primary-container: #4f378b;
  --ii-on-primary: #381e72;
  --ii-on-primary-container: #eaddff;
  --ii-surface: #141218;
  --ii-surface-container: #211f26;
  --ii-surface-container-high: #2b2930;
  --ii-on-surface: #e6e0e9;
  --ii-on-surface-variant: #cac4d0;
  --ii-outline: #938f99;
  --ii-outline-variant: #49454f;
  --ii-error: #f2b8b5;
  --ii-success: #7dd99a;
  --ii-info: #a8c7fa;
  --ii-warning: #ffb872;
  --ii-shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
  --ii-shadow-md: 0 4px 12px rgba(0,0,0,0.35);
  --ii-shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
  color-scheme: dark;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --ii-primary: #d0bcff;
    --ii-primary-container: #4f378b;
    --ii-on-primary: #381e72;
    --ii-on-primary-container: #eaddff;
    --ii-surface: #141218;
    --ii-surface-container: #211f26;
    --ii-surface-container-high: #2b2930;
    --ii-on-surface: #e6e0e9;
    --ii-on-surface-variant: #cac4d0;
    --ii-outline: #938f99;
    --ii-outline-variant: #49454f;
    --ii-error: #f2b8b5;
    --ii-success: #7dd99a;
    --ii-info: #a8c7fa;
    --ii-warning: #ffb872;
    --ii-shadow-sm: 0 1px 3px rgba(0,0,0,0.4);
    --ii-shadow-md: 0 4px 12px rgba(0,0,0,0.35);
    --ii-shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
    color-scheme: dark;
  }
}
`;

/** CSS reset: box-sizing, body defaults, scroll behavior. */
export const RESET_CSS = `/* --- Reset --- */
html {
  scroll-behavior: smooth;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--ii-font-family);
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  background: var(--ii-surface);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
/* Offset for fixed headers when scrolling to anchors */
[id] {
  scroll-margin-top: var(--ii-scroll-offset, 80px);
}
`;

/** Icon base styles. */
export const ICON_CSS = `/* --- Icon --- */
.ii-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
.ii-accordion__icon {
  transition: transform 0.2s ease;
}
.ii-accordion__icon--open {
  transform: rotate(180deg);
}
`;

/** Shared keyframe animations. */
export const ANIMATIONS_CSS = `/* --- Utility: Animations --- */
@keyframes ii-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ii-slide-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
`;

/** Combined base CSS (variables + reset + icon + animations). */
export const BASE_CSS = [VARIABLES_CSS, RESET_CSS, ICON_CSS, ANIMATIONS_CSS].join("\n");
