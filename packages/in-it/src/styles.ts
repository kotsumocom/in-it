/**
 * @module styles
 * Auto-generated from CSS component files.
 * DO NOT EDIT — run `deno task build:styles` to regenerate.
 *
 * Provides runtime CSS injection so in-it works without
 * any CSS file imports or build tool configuration.
 *
 * @example
 * ```tsx
 * import { injectStyles } from "@kotsumo/in-it/styles";
 *
 * // Call once at app startup
 * injectStyles();
 * ```
 *
 * Or use the component version:
 * ```tsx
 * import { StyleSheet } from "@kotsumo/in-it/styles";
 *
 * function App() {
 *   return (
 *     <>
 *       <StyleSheet />
 *       <MyApp />
 *     </>
 *   );
 * }
 * ```
 */

/** All in-it CSS as a string */
export const CSS = `/* --- Variables --- */
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
  --ii-font-family: 'Noto Sans JP', 'Inter', system-ui, sans-serif;
  --ii-font-sm: 0.75rem;
  --ii-font-base: 0.875rem;
  --ii-font-lg: 1rem;
  --ii-font-xl: 1.25rem;
  --ii-font-2xl: 1.5rem;
  color-scheme: light;
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

/* --- Reset --- */
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
}
/* Offset for fixed headers when scrolling to anchors */
[id] {
  scroll-margin-top: var(--ii-scroll-offset, 80px);
}

/* --- Icon --- */
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

/* --- Utility: Animations --- */
@keyframes ii-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ii-slide-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

/* --- Utility: Fade In --- */
@keyframes ii-fade-in {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* --- Button --- */
.ii-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  font-family: inherit;
  font-weight: 500;
  border: none;
  border-radius: var(--ii-shape-sm);
  cursor: pointer;
  transition: background var(--ii-transition), box-shadow var(--ii-transition);
  white-space: nowrap;
}
.ii-btn--sm { padding: 6px 12px; font-size: var(--ii-font-sm); }
.ii-btn--md { padding: 10px 20px; font-size: var(--ii-font-base); }
.ii-btn--lg { padding: 12px 24px; font-size: var(--ii-font-lg); }
.ii-btn--filled {
  background: var(--ii-primary);
  color: var(--ii-on-primary);
}
.ii-btn--filled:hover { box-shadow: var(--ii-shadow-sm); filter: brightness(1.1); }
.ii-btn--outlined {
  background: transparent;
  color: var(--ii-primary);
  border: 1px solid var(--ii-outline);
}
.ii-btn--outlined:hover { background: color-mix(in srgb, var(--ii-primary) 8%, transparent); }
.ii-btn--text {
  background: transparent;
  color: var(--ii-on-surface-variant);
  padding-inline: var(--ii-spacing-2);
}
.ii-btn--text:hover { background: var(--ii-surface-container-high); }

/* --- Badge --- */
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

/* --- Card --- */
.ii-card {
  background: var(--ii-surface);
  border-radius: var(--ii-shape-md);
  padding: var(--ii-spacing-5);
}
.ii-card--outlined {
  border: 1px solid var(--ii-outline-variant);
}

/* --- Stat Card --- */
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

/* --- Switch --- */
.ii-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ii-spacing-4);
  padding: 14px 0;
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-switch__info { flex: 1; min-width: 0; }
.ii-switch__label {
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface);
  cursor: pointer;
}
.ii-switch__desc {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin-top: 2px;
}
.ii-switch__track {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: var(--ii-outline);
  position: relative;
  cursor: pointer;
  transition: background var(--ii-transition);
  border: none;
  padding: 0;
  flex-shrink: 0;
}
.ii-switch__track:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
}
.ii-switch__track--checked { background: var(--ii-primary); }
.ii-switch__track--disabled { opacity: 0.38; cursor: not-allowed; }
.ii-switch__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  transition: transform var(--ii-transition);
  box-shadow: var(--ii-shadow-sm);
}
.ii-switch__track--checked .ii-switch__thumb {
  transform: translateX(20px);
}

/* --- Data Table --- */
.ii-data-table-wrap {
  overflow-x: auto;
}
.ii-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ii-font-base);
}
.ii-data-table th {
  text-align: left;
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
  border-bottom: 1px solid var(--ii-outline-variant);
  font-size: var(--ii-font-sm);
}
.ii-data-table td {
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-data-table__th--right, .ii-data-table__td--right { text-align: right; }
.ii-data-table__th--center, .ii-data-table__td--center { text-align: center; }

/* --- Section --- */
.ii-section {
  margin-top: var(--ii-spacing-6);
}
.ii-section__title {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  margin-bottom: var(--ii-spacing-4);
}

/* --- Dialog --- */
.ii-dialog__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ii-fade-in 150ms ease;
}
.ii-dialog {
  background: var(--ii-surface);
  border-radius: var(--ii-shape-lg);
  padding: var(--ii-spacing-6);
  min-width: 360px;
  max-width: 560px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  animation: ii-slide-up 200ms ease;
}
.ii-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ii-spacing-4);
}
.ii-dialog__title {
  font-size: var(--ii-font-xl);
  font-weight: 600;
}
.ii-dialog__close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--ii-on-surface-variant);
  padding: var(--ii-spacing-2);
  border-radius: var(--ii-shape-sm);
}
.ii-dialog__close:hover { background: var(--ii-surface-container-high); }
.ii-dialog__desc {
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-base);
  margin-bottom: var(--ii-spacing-4);
}
.ii-dialog__body { }
@keyframes ii-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ii-slide-up {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* --- Tabs --- */
.ii-tabs { }
.ii-tabs__list {
  display: flex;
  border-bottom: 1px solid var(--ii-outline-variant);
  gap: 0;
}
.ii-tabs__tab {
  padding: var(--ii-spacing-3) var(--ii-spacing-5);
  font-family: inherit;
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color var(--ii-transition), border-color var(--ii-transition);
}
.ii-tabs__tab:hover { color: var(--ii-on-surface); }
.ii-tabs__tab--active {
  color: var(--ii-primary);
  border-bottom-color: var(--ii-primary);
}
.ii-tabs__tab:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-tabs__tab:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: -2px;
}
.ii-tabs__panels { padding-top: var(--ii-spacing-5); }
.ii-tabs__panel { }
.ii-tabs__panel[hidden] { display: none; }

/* --- Menu --- */
.ii-menu {
  position: relative;
  display: inline-block;
}
.ii-menu__trigger {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: var(--ii-spacing-2);
  border-radius: var(--ii-shape-sm);
  color: var(--ii-on-surface-variant);
}
.ii-menu__trigger:hover { background: var(--ii-surface-container-high); }
.ii-menu__dropdown {
  position: absolute;
  top: 100%;
  margin-top: 4px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md);
  min-width: 180px;
  padding: 4px;
  z-index: 50;
  animation: ii-fade-in 100ms ease;
}
.ii-menu__dropdown--left { left: 0; }
.ii-menu__dropdown--right { right: 0; }
.ii-menu__item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  width: 100%;
  padding: 8px 12px;
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  background: none;
  border: none;
  border-radius: var(--ii-shape-sm);
  cursor: pointer;
  text-align: left;
}
.ii-menu__item:hover, .ii-menu__item--focused {
  background: var(--ii-surface-container-high);
}
.ii-menu__item--disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-menu__icon { font-size: 1.1rem; }
.ii-menu__separator {
  height: 1px;
  background: var(--ii-outline-variant);
  margin: 4px 0;
}

/* --- Toast --- */
.ii-toast-container {
  position: fixed;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-2);
  max-width: 400px;
  pointer-events: none;
}
.ii-toast-container--top-right { top: var(--ii-spacing-6); right: var(--ii-spacing-6); }
.ii-toast-container--top-left { top: var(--ii-spacing-6); left: var(--ii-spacing-6); }
.ii-toast-container--bottom-right { bottom: var(--ii-spacing-6); right: var(--ii-spacing-6); }
.ii-toast-container--bottom-left { bottom: var(--ii-spacing-6); left: var(--ii-spacing-6); }
.ii-toast {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md);
  pointer-events: auto;
  animation: ii-slide-up 200ms ease;
  font-size: var(--ii-font-base);
}
.ii-toast--success { background: color-mix(in srgb, var(--ii-success) 12%, var(--ii-surface)); border-left: 3px solid var(--ii-success); }
.ii-toast--error { background: color-mix(in srgb, var(--ii-error) 12%, var(--ii-surface)); border-left: 3px solid var(--ii-error); }
.ii-toast--warning { background: color-mix(in srgb, var(--ii-warning) 12%, var(--ii-surface)); border-left: 3px solid var(--ii-warning); }
.ii-toast--info { background: color-mix(in srgb, var(--ii-info) 12%, var(--ii-surface)); border-left: 3px solid var(--ii-info); }
.ii-toast__icon { font-size: 1.1rem; flex-shrink: 0; }
.ii-toast__message { flex: 1; }
.ii-toast__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ii-on-surface-variant);
  padding: 2px;
  font-size: 0.85rem;
}

/* --- Select --- */
.ii-select {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
  position: relative;
}
.ii-select__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
.ii-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  cursor: pointer;
  transition: border-color var(--ii-transition);
}
.ii-select__trigger:hover { border-color: var(--ii-outline); }
.ii-select__trigger:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
}
.ii-select__value--placeholder { color: var(--ii-on-surface-variant); }
.ii-select__arrow {
  font-size: 0.7rem;
  color: var(--ii-on-surface-variant);
  margin-left: var(--ii-spacing-2);
}
.ii-select__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md);
  padding: 4px;
  z-index: 50;
  max-height: 240px;
  overflow-y: auto;
  animation: ii-fade-in 100ms ease;
}
.ii-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--ii-shape-sm);
  cursor: pointer;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
}
.ii-select__option:hover, .ii-select__option--highlighted {
  background: var(--ii-surface-container-high);
}
.ii-select__option--selected {
  color: var(--ii-primary);
  font-weight: 500;
}
.ii-select__option--disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-select__check {
  color: var(--ii-primary);
  font-weight: 600;
}

/* --- Accordion --- */
.ii-accordion {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  overflow: hidden;
}
.ii-accordion__item {
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-accordion__item:last-child { border-bottom: none; }
.ii-accordion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  background: var(--ii-surface);
  border: none;
  font-family: inherit;
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface);
  cursor: pointer;
  transition: background var(--ii-transition);
}
.ii-accordion__header:hover { background: var(--ii-surface-container-high); }
.ii-accordion__header:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: -2px;
}
.ii-accordion__header:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-accordion__chevron {
  font-size: 0.7rem;
  color: var(--ii-on-surface-variant);
  transition: transform 200ms ease;
}
.ii-accordion__chevron--open {
  transform: rotate(180deg);
}
.ii-accordion__panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 200ms ease;
}
.ii-accordion__panel--open {
  max-height: 500px;
}
.ii-accordion__panel[hidden] { display: none; }
.ii-accordion__content {
  padding: 0 16px 16px;
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-base);
  line-height: 1.6;
}

/* --- Popover --- */
.ii-popover {
  position: relative;
  display: inline-block;
}
.ii-popover__trigger {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: var(--ii-on-surface);
}
.ii-popover__content {
  position: absolute;
  top: 100%;
  margin-top: 8px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  box-shadow: var(--ii-shadow-lg);
  padding: var(--ii-spacing-4);
  min-width: 240px;
  z-index: 50;
  animation: ii-slide-up 150ms ease;
}
.ii-popover__content--left { left: 0; }
.ii-popover__content--right { right: 0; }
.ii-popover__content--center { left: 50%; transform: translateX(-50%); }

/* --- Input / TextField --- */
.ii-input {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
}
.ii-input__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
.ii-input__field {
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  transition: border-color var(--ii-transition);
}
.ii-input__field:hover { border-color: var(--ii-outline); }
.ii-input__field:focus {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
  border-color: var(--ii-primary);
}
.ii-input__field::placeholder { color: var(--ii-on-surface-variant); }
.ii-input__helper {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-input__error {
  font-size: var(--ii-font-sm);
  color: var(--ii-error);
}

/* --- Input Validation States --- */
.ii-input--error .ii-input__field,
.ii-input__field[aria-invalid="true"] {
  border-color: var(--ii-error);
}
.ii-input--error .ii-input__field:focus,
.ii-input__field[aria-invalid="true"]:focus {
  outline-color: var(--ii-error);
}
.ii-input--success .ii-input__field {
  border-color: var(--ii-success);
}
.ii-input--success .ii-input__field:focus {
  outline-color: var(--ii-success);
}
/* Also support bare input elements using ii-input class */
input.ii-input, select.ii-input, textarea.ii-input {
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  transition: border-color var(--ii-transition);
  width: 100%;
  box-sizing: border-box;
}
input.ii-input:hover, select.ii-input:hover, textarea.ii-input:hover {
  border-color: var(--ii-outline);
}
input.ii-input:focus, select.ii-input:focus, textarea.ii-input:focus {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
  border-color: var(--ii-primary);
}
input.ii-input::placeholder, textarea.ii-input::placeholder {
  color: var(--ii-on-surface-variant);
}
.ii-input-field {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
}
.ii-input-field__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}

/* --- Chip / Tag --- */
.ii-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: var(--ii-font-sm);
  font-weight: 500;
  border: 1px solid var(--ii-outline-variant);
  background: var(--ii-surface);
  color: var(--ii-on-surface);
  cursor: default;
}
.ii-chip--primary { background: var(--ii-primary-container); color: var(--ii-primary); border-color: transparent; }
.ii-chip--success { background: color-mix(in srgb, var(--ii-success) 12%, var(--ii-surface)); color: var(--ii-success); border-color: transparent; }
.ii-chip--error { background: color-mix(in srgb, var(--ii-error) 12%, var(--ii-surface)); color: var(--ii-error); border-color: transparent; }
.ii-chip__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: inherit;
  padding: 0;
  margin-left: 2px;
}

/* --- Avatar --- */
.ii-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--ii-primary-container);
  color: var(--ii-primary);
  font-weight: 600;
  overflow: hidden;
}
.ii-avatar--sm { width: 32px; height: 32px; font-size: 0.8rem; }
.ii-avatar--md { width: 40px; height: 40px; font-size: 1rem; }
.ii-avatar--lg { width: 56px; height: 56px; font-size: 1.25rem; }
.ii-avatar img { width: 100%; height: 100%; object-fit: cover; }

/* --- Skeleton --- */
.ii-skeleton {
  background: linear-gradient(90deg, var(--ii-surface-container) 25%, var(--ii-surface-container-high) 50%, var(--ii-surface-container) 75%);
  background-size: 200% 100%;
  animation: ii-skeleton-shimmer 1.5s infinite;
  border-radius: var(--ii-shape-sm);
}
.ii-skeleton--text { height: 1em; width: 100%; }
.ii-skeleton--circle { border-radius: 50%; }
@keyframes ii-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* --- Empty State --- */
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

/* --- Theme Toggle --- */
.ii-theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: var(--ii-spacing-2);
  border-radius: var(--ii-shape-sm);
  transition: background var(--ii-transition);
}
.ii-theme-toggle:hover { background: var(--ii-surface-container-high); }
.ii-theme-toggle-group {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  background: var(--ii-surface-container);
  border-radius: var(--ii-shape-md);
}
.ii-theme-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 6px 10px;
  border-radius: var(--ii-shape-sm);
  transition: background var(--ii-transition);
}
.ii-theme-toggle-btn:hover { background: var(--ii-surface-container-high); }
.ii-theme-toggle-btn--active {
  background: var(--ii-surface);
  box-shadow: var(--ii-shadow-sm);
}

/* --- Combobox --- */
.ii-combobox {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
  position: relative;
}
.ii-combobox__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
.ii-combobox__input {
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  transition: border-color var(--ii-transition);
}
.ii-combobox__input:hover { border-color: var(--ii-outline); }
.ii-combobox__input:focus {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
  border-color: var(--ii-primary);
}
.ii-combobox__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md);
  padding: 4px;
  z-index: 50;
  max-height: 240px;
  overflow-y: auto;
  animation: ii-fade-in 100ms ease;
}
.ii-combobox__option {
  padding: 8px 12px;
  border-radius: var(--ii-shape-sm);
  cursor: pointer;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
}
.ii-combobox__option:hover, .ii-combobox__option--highlighted {
  background: var(--ii-surface-container-high);
}
.ii-combobox__option--selected {
  color: var(--ii-primary);
  font-weight: 500;
}
.ii-combobox__option--disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-combobox__empty {
  padding: 12px;
  text-align: center;
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-sm);
}

/* --- Checkbox --- */
.ii-checkbox { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.ii-checkbox--disabled { cursor: not-allowed; opacity: 0.38; }
.ii-checkbox__control {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border: 2px solid var(--ii-on-surface-variant);
  border-radius: 4px; background: transparent; color: transparent; flex-shrink: 0;
  transition: all var(--ii-transition);
}
.ii-checkbox__control--checked, .ii-checkbox__control--indeterminate {
  background: var(--ii-primary); border-color: var(--ii-primary); color: var(--ii-on-primary);
}
.ii-checkbox__control:hover { border-color: var(--ii-on-surface); }
.ii-checkbox__indicator { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 0.7rem; }
.ii-checkbox__label { font-size: var(--ii-font-base); color: var(--ii-on-surface); }
.ii-checkbox__input { position: absolute; opacity: 0; width: 0; height: 0; }

/* --- Radio Group --- */
.ii-radio-group { display: flex; flex-direction: column; gap: 8px; }
.ii-radio-group--horizontal { flex-direction: row; gap: 16px; }
.ii-radio { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.ii-radio--disabled { cursor: not-allowed; opacity: 0.38; }
.ii-radio__control {
  width: 20px; height: 20px; border: 2px solid var(--ii-on-surface-variant);
  border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all var(--ii-transition);
}
.ii-radio__control--checked { border-color: var(--ii-primary); }
.ii-radio__control--checked::after {
  content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--ii-primary);
}
.ii-radio__control:hover { border-color: var(--ii-on-surface); }
.ii-radio__label { font-size: var(--ii-font-base); color: var(--ii-on-surface); }

/* --- Textarea --- */
.ii-textarea { display: flex; flex-direction: column; gap: var(--ii-spacing-1); }
.ii-textarea__label { font-size: var(--ii-font-sm); font-weight: 500; color: var(--ii-on-surface-variant); }
.ii-textarea__field {
  padding: 10px 12px; background: var(--ii-surface); border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md); font-family: inherit; font-size: var(--ii-font-base);
  color: var(--ii-on-surface); min-height: 100px; resize: vertical; transition: border-color var(--ii-transition);
}
.ii-textarea__field:hover { border-color: var(--ii-outline); }
.ii-textarea__field:focus { outline: 2px solid var(--ii-primary); outline-offset: 2px; border-color: var(--ii-primary); }
.ii-textarea__field::placeholder { color: var(--ii-on-surface-variant); }
.ii-textarea__count { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); text-align: right; }

/* --- Slider --- */
.ii-slider { display: flex; flex-direction: column; gap: 8px; }
.ii-slider__label { display: flex; justify-content: space-between; font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-slider__track { position: relative; height: 4px; background: var(--ii-outline-variant); border-radius: 2px; cursor: pointer; }
.ii-slider__fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--ii-primary); border-radius: 2px; }
.ii-slider__thumb {
  position: absolute; top: 50%; width: 20px; height: 20px; border-radius: 50%;
  background: var(--ii-primary); transform: translate(-50%, -50%); cursor: grab;
  box-shadow: var(--ii-shadow-sm); transition: box-shadow var(--ii-transition);
}
.ii-slider__thumb:hover { box-shadow: 0 0 0 8px color-mix(in srgb, var(--ii-primary) 12%, transparent); }
.ii-slider__thumb:active { cursor: grabbing; }

/* --- Number Input --- */
.ii-number-input { display: inline-flex; align-items: center; border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-md); overflow: hidden; }
.ii-number-input__btn {
  display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;
  background: var(--ii-surface-container); border: none; cursor: pointer; font-size: 1rem;
  color: var(--ii-on-surface); transition: background var(--ii-transition);
}
.ii-number-input__btn:hover { background: var(--ii-surface-container-high); }
.ii-number-input__btn:disabled { opacity: 0.38; cursor: not-allowed; }
.ii-number-input__field {
  width: 60px; text-align: center; border: none; background: var(--ii-surface);
  font-family: inherit; font-size: var(--ii-font-base); color: var(--ii-on-surface); padding: 6px 4px;
}
.ii-number-input__field:focus { outline: none; }

/* --- Password Input --- */
.ii-password-input { position: relative; }
.ii-password-input .ii-input__field { padding-right: 40px; }
.ii-password-input__toggle {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 1rem; color: var(--ii-on-surface-variant);
}

/* --- Pin Input --- */
.ii-pin-input { display: inline-flex; gap: 8px; }
.ii-pin-input__field {
  width: 42px; height: 48px; text-align: center; font-size: 1.25rem; font-weight: 600;
  border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-md);
  background: var(--ii-surface); color: var(--ii-on-surface); transition: border-color var(--ii-transition);
}
.ii-pin-input__field:focus { outline: 2px solid var(--ii-primary); outline-offset: 2px; border-color: var(--ii-primary); }

/* --- Tags Input --- */
.ii-tags-input {
  display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 12px; min-height: 42px;
  border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-md);
  background: var(--ii-surface); transition: border-color var(--ii-transition); align-items: center;
}
.ii-tags-input:focus-within { border-color: var(--ii-primary); outline: 2px solid var(--ii-primary); outline-offset: 2px; }
.ii-tags-input__tag {
  display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 99px;
  background: var(--ii-primary-container); color: var(--ii-on-primary-container); font-size: var(--ii-font-sm);
}
.ii-tags-input__remove { background: none; border: none; cursor: pointer; font-size: 0.7rem; color: inherit; padding: 0; }
.ii-tags-input__field {
  flex: 1; min-width: 80px; border: none; background: transparent; outline: none;
  font-family: inherit; font-size: var(--ii-font-base); color: var(--ii-on-surface);
}

/* --- Toggle --- */
.ii-toggle {
  display: inline-flex; align-items: center; justify-content: center; padding: 8px 16px;
  border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-md);
  background: var(--ii-surface); cursor: pointer; font-family: inherit; font-size: var(--ii-font-sm);
  font-weight: 500; color: var(--ii-on-surface); transition: all var(--ii-transition);
}
.ii-toggle:hover { background: var(--ii-surface-container); }
.ii-toggle--pressed { background: var(--ii-primary-container); color: var(--ii-primary); border-color: var(--ii-primary); }

/* --- Toggle Group --- */
.ii-toggle-group { display: inline-flex; border-radius: var(--ii-shape-md); overflow: hidden; border: 1px solid var(--ii-outline-variant); }
.ii-toggle-group .ii-toggle { border-radius: 0; border: none; border-right: 1px solid var(--ii-outline-variant); }
.ii-toggle-group .ii-toggle:last-child { border-right: none; }

/* --- Alert --- */
.ii-alert {
  display: flex; gap: 12px; padding: 16px; border-radius: var(--ii-shape-md);
  border: 1px solid var(--ii-outline-variant); background: var(--ii-surface);
}
.ii-alert--info { border-color: var(--ii-info); background: color-mix(in srgb, var(--ii-info) 8%, var(--ii-surface)); }
.ii-alert--success { border-color: var(--ii-success); background: color-mix(in srgb, var(--ii-success) 8%, var(--ii-surface)); }
.ii-alert--warning { border-color: var(--ii-warning); background: color-mix(in srgb, var(--ii-warning) 8%, var(--ii-surface)); }
.ii-alert--error { border-color: var(--ii-error); background: color-mix(in srgb, var(--ii-error) 8%, var(--ii-surface)); }
.ii-alert__icon { font-size: 1.25rem; flex-shrink: 0; }
.ii-alert__body { flex: 1; }
.ii-alert__title { font-weight: 600; margin-bottom: 4px; }
.ii-alert__desc { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-alert__close { background: none; border: none; cursor: pointer; color: var(--ii-on-surface-variant); font-size: 1rem; padding: 0; }

/* --- Drawer --- */
.ii-drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100;
  animation: ii-fade-in 200ms ease;
}
.ii-drawer {
  position: fixed; z-index: 101; background: var(--ii-surface);
  box-shadow: var(--ii-shadow-lg); display: flex; flex-direction: column;
}
.ii-drawer--left { top: 0; bottom: 0; left: 0; width: 320px; animation: ii-slide-in-left 200ms ease; }
.ii-drawer--right { top: 0; bottom: 0; right: 0; width: 320px; animation: ii-slide-in-right 200ms ease; }
.ii-drawer--top { top: 0; left: 0; right: 0; height: 320px; animation: ii-slide-in-top 200ms ease; }
.ii-drawer--bottom { bottom: 0; left: 0; right: 0; height: 320px; animation: ii-slide-in-bottom 200ms ease; }
.ii-drawer__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--ii-outline-variant); }
.ii-drawer__title { font-size: var(--ii-font-lg); font-weight: 600; }
.ii-drawer__close { background: none; border: none; cursor: pointer; font-size: 1.25rem; color: var(--ii-on-surface-variant); }
.ii-drawer__body { flex: 1; padding: 20px; overflow-y: auto; }
.ii-drawer__footer { padding: 16px 20px; border-top: 1px solid var(--ii-outline-variant); }
@keyframes ii-slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes ii-slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes ii-slide-in-top { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes ii-slide-in-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }

/* --- Progress Bar --- */
.ii-progress { display: flex; flex-direction: column; gap: 6px; }
.ii-progress__label { display: flex; justify-content: space-between; font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-progress__track { height: 4px; background: var(--ii-outline-variant); border-radius: 2px; overflow: hidden; }
.ii-progress__fill { height: 100%; background: var(--ii-primary); border-radius: 2px; transition: width 300ms ease; }
.ii-progress__fill--indeterminate {
  width: 40%; animation: ii-progress-indeterminate 1.5s infinite ease-in-out;
}
@keyframes ii-progress-indeterminate {
  0% { transform: translateX(-100%); } 100% { transform: translateX(350%); }
}

/* --- Progress Circular --- */
.ii-progress-circular { display: inline-flex; position: relative; }
.ii-progress-circular__svg { transform: rotate(-90deg); }
.ii-progress-circular__track { stroke: var(--ii-outline-variant); fill: none; }
.ii-progress-circular__fill { stroke: var(--ii-primary); fill: none; stroke-linecap: round; transition: stroke-dashoffset 300ms ease; }
.ii-progress-circular__label {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: var(--ii-font-sm); font-weight: 600; color: var(--ii-on-surface);
}

/* --- Pagination --- */
.ii-pagination { display: flex; align-items: center; gap: 4px; }
.ii-pagination__btn {
  display: flex; align-items: center; justify-content: center;
  min-width: 36px; height: 36px; border-radius: var(--ii-shape-sm);
  border: none; background: transparent; cursor: pointer; font-family: inherit;
  font-size: var(--ii-font-sm); font-weight: 500; color: var(--ii-on-surface);
  transition: all var(--ii-transition);
}
.ii-pagination__btn:hover { background: var(--ii-surface-container-high); }
.ii-pagination__btn--active { background: var(--ii-primary); color: var(--ii-on-primary); }
.ii-pagination__btn:disabled { opacity: 0.38; cursor: not-allowed; }
.ii-pagination__ellipsis { padding: 0 4px; color: var(--ii-on-surface-variant); }

/* --- Steps --- */
.ii-steps { display: flex; gap: 4px; }
.ii-steps--vertical { flex-direction: column; }
.ii-step { display: flex; align-items: center; gap: 8px; flex: 1; }
.ii-step__indicator {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: var(--ii-font-sm); font-weight: 600; flex-shrink: 0;
  border: 2px solid var(--ii-outline-variant); background: var(--ii-surface); color: var(--ii-on-surface-variant);
}
.ii-step--active .ii-step__indicator { border-color: var(--ii-primary); background: var(--ii-primary); color: var(--ii-on-primary); }
.ii-step--completed .ii-step__indicator { border-color: var(--ii-primary); background: var(--ii-primary); color: var(--ii-on-primary); }
.ii-step__content { flex: 1; min-width: 0; }
.ii-step__title { font-size: var(--ii-font-sm); font-weight: 600; }
.ii-step__desc { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-step__separator { flex: 1; height: 2px; background: var(--ii-outline-variant); margin: 0 8px; }
.ii-step--completed + .ii-step .ii-step__separator,
.ii-step--active + .ii-step .ii-step__separator { background: var(--ii-primary); }

/* --- Segmented Control --- */
.ii-segmented {
  display: inline-flex; padding: 2px; background: var(--ii-surface-container);
  border-radius: var(--ii-shape-md); gap: 2px;
}
.ii-segmented__btn {
  padding: 8px 16px; border: none; background: transparent; border-radius: var(--ii-shape-sm);
  cursor: pointer; font-family: inherit; font-size: var(--ii-font-sm); font-weight: 500;
  color: var(--ii-on-surface-variant); transition: all var(--ii-transition);
}
.ii-segmented__btn:hover { color: var(--ii-on-surface); }
.ii-segmented__btn--active { background: var(--ii-surface); color: var(--ii-on-surface); box-shadow: var(--ii-shadow-sm); }

/* --- Collapsible --- */
.ii-collapsible {}
.ii-collapsible__trigger {
  display: flex; align-items: center; justify-content: space-between; width: 100%;
  padding: 12px 0; background: none; border: none; cursor: pointer; font-family: inherit;
  font-size: var(--ii-font-base); font-weight: 500; color: var(--ii-on-surface); text-align: left;
}
.ii-collapsible__chevron { font-size: 0.7rem; color: var(--ii-on-surface-variant); transition: transform 200ms ease; }
.ii-collapsible__chevron--open { transform: rotate(180deg); }
.ii-collapsible__content { overflow: hidden; transition: max-height 200ms ease; }
.ii-collapsible__content[hidden] { display: none; }

/* --- HoverCard --- */
.ii-hover-card { position: relative; display: inline-block; }
.ii-hover-card__content {
  position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
  margin-bottom: 8px; background: var(--ii-surface); border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg); box-shadow: var(--ii-shadow-lg); padding: 16px;
  min-width: 280px; z-index: 50; animation: ii-fade-in 100ms ease;
}

/* --- Clipboard --- */
.ii-clipboard { display: inline-flex; align-items: center; gap: 8px; }
.ii-clipboard__text {
  padding: 8px 12px; background: var(--ii-surface-container); border-radius: var(--ii-shape-sm);
  font-family: 'Fira Code', monospace; font-size: var(--ii-font-sm); color: var(--ii-on-surface);
  user-select: all;
}
.ii-clipboard__btn {
  display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;
  border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-sm);
  background: var(--ii-surface); cursor: pointer; transition: all var(--ii-transition);
}
.ii-clipboard__btn:hover { background: var(--ii-surface-container-high); }

/* --- Breadcrumb --- */
.ii-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: var(--ii-font-sm); }
.ii-breadcrumb__item { color: var(--ii-on-surface-variant); text-decoration: none; }
.ii-breadcrumb__item:hover { color: var(--ii-primary); }
.ii-breadcrumb__item--current { color: var(--ii-on-surface); font-weight: 500; }
.ii-breadcrumb__sep { color: var(--ii-outline); font-size: 0.7rem; }

/* --- File Upload --- */
.ii-file-upload {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 40px 20px; border: 2px dashed var(--ii-outline-variant); border-radius: var(--ii-shape-lg);
  background: var(--ii-surface); cursor: pointer; transition: all var(--ii-transition); text-align: center;
}
.ii-file-upload:hover { border-color: var(--ii-primary); background: color-mix(in srgb, var(--ii-primary) 4%, var(--ii-surface)); }
.ii-file-upload--dragover { border-color: var(--ii-primary); background: color-mix(in srgb, var(--ii-primary) 8%, var(--ii-surface)); }
.ii-file-upload__icon { font-size: 2.5rem; margin-bottom: 12px; }
.ii-file-upload__title { font-weight: 600; margin-bottom: 4px; }
.ii-file-upload__desc { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-file-upload__input { display: none; }
.ii-file-upload__files { width: 100%; margin-top: 16px; display: flex; flex-direction: column; gap: 8px; }
.ii-file-upload__file {
  display: flex; align-items: center; gap: 8px; padding: 8px 12px;
  background: var(--ii-surface-container); border-radius: var(--ii-shape-sm);
  font-size: var(--ii-font-sm);
}
.ii-file-upload__file-remove { background: none; border: none; cursor: pointer; color: var(--ii-error); }

/* --- Editable --- */
.ii-editable { display: inline-flex; align-items: center; gap: 8px; }
.ii-editable__preview {
  padding: 4px 8px; border-radius: var(--ii-shape-sm); cursor: pointer;
  border: 1px solid transparent; transition: all var(--ii-transition);
}
.ii-editable__preview:hover { background: var(--ii-surface-container); border-color: var(--ii-outline-variant); }
.ii-editable__input {
  padding: 4px 8px; border: 1px solid var(--ii-primary); border-radius: var(--ii-shape-sm);
  font-family: inherit; font-size: inherit; color: var(--ii-on-surface);
  outline: 2px solid var(--ii-primary); outline-offset: 2px;
}
.ii-editable__actions { display: flex; gap: 4px; }
.ii-editable__btn {
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-sm);
  background: var(--ii-surface); cursor: pointer; font-size: 0.75rem;
}

/* --- Rating Group --- */
.ii-rating { display: inline-flex; gap: 4px; }
.ii-rating__star {
  font-size: 1.5rem; cursor: pointer; color: var(--ii-outline-variant);
  transition: color var(--ii-transition), transform 100ms ease;
}
.ii-rating__star--filled { color: #f59e0b; }
.ii-rating__star:hover { transform: scale(1.2); }

/* --- NavigationMenu --- */
.ii-nav-menu { display: flex; align-items: center; gap: 4px; }
.ii-nav-menu__item {
  padding: 8px 16px; border-radius: var(--ii-shape-sm); background: none; border: none;
  cursor: pointer; font-family: inherit; font-size: var(--ii-font-base); font-weight: 500;
  color: var(--ii-on-surface-variant); transition: all var(--ii-transition); text-decoration: none;
}
.ii-nav-menu__item:hover { background: var(--ii-surface-container); color: var(--ii-on-surface); }
.ii-nav-menu__item--active { color: var(--ii-primary); background: color-mix(in srgb, var(--ii-primary) 8%, transparent); }
.ii-nav-menu__dropdown {
  position: absolute; top: 100%; left: 0; margin-top: 4px; background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md); padding: 4px; min-width: 200px; z-index: 50;
}
.ii-nav-menu__link {
  display: block; padding: 8px 12px; border-radius: var(--ii-shape-sm);
  color: var(--ii-on-surface); text-decoration: none; font-size: var(--ii-font-sm);
  transition: background var(--ii-transition);
}
.ii-nav-menu__link:hover { background: var(--ii-surface-container-high); }

/* --- Listbox --- */
.ii-listbox {
  border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-md);
  background: var(--ii-surface); max-height: 300px; overflow-y: auto; padding: 4px;
}
.ii-listbox__option {
  padding: 8px 12px; border-radius: var(--ii-shape-sm); cursor: pointer;
  font-size: var(--ii-font-base); color: var(--ii-on-surface); transition: background var(--ii-transition);
}
.ii-listbox__option:hover { background: var(--ii-surface-container-high); }
.ii-listbox__option--selected { background: color-mix(in srgb, var(--ii-primary) 12%, var(--ii-surface)); color: var(--ii-primary); font-weight: 500; }
.ii-listbox__option--disabled { opacity: 0.38; cursor: not-allowed; }
.ii-listbox__group-label { padding: 8px 12px; font-size: var(--ii-font-sm); font-weight: 600; color: var(--ii-on-surface-variant); }

/* --- Carousel --- */
.ii-carousel { position: relative; overflow: hidden; border-radius: var(--ii-shape-lg); }
.ii-carousel__track { display: flex; transition: transform 300ms ease; }
.ii-carousel__slide { min-width: 100%; flex-shrink: 0; }
.ii-carousel__btn {
  position: absolute; top: 50%; transform: translateY(-50%); width: 40px; height: 40px;
  border-radius: 50%; background: color-mix(in srgb, var(--ii-surface) 90%, transparent);
  border: 1px solid var(--ii-outline-variant); cursor: pointer; display: flex;
  align-items: center; justify-content: center; font-size: 1rem; z-index: 2;
  backdrop-filter: blur(8px); transition: all var(--ii-transition);
}
.ii-carousel__btn:hover { background: var(--ii-surface); box-shadow: var(--ii-shadow-md); }
.ii-carousel__btn--prev { left: 12px; }
.ii-carousel__btn--next { right: 12px; }
.ii-carousel__dots { display: flex; justify-content: center; gap: 6px; padding: 12px; }
.ii-carousel__dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--ii-outline-variant);
  border: none; cursor: pointer; transition: all var(--ii-transition);
}
.ii-carousel__dot--active { background: var(--ii-primary); width: 24px; border-radius: 4px; }

/* --- Marquee --- */
.ii-marquee { overflow: hidden; width: 100%; }
.ii-marquee__track { display: flex; animation: ii-marquee-scroll 20s linear infinite; width: max-content; }
.ii-marquee__track:hover { animation-play-state: paused; }
@keyframes ii-marquee-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* --- Timer --- */
.ii-timer { display: inline-flex; gap: 8px; align-items: center; }
.ii-timer__segment {
  display: flex; flex-direction: column; align-items: center; padding: 8px 12px;
  background: var(--ii-surface-container); border-radius: var(--ii-shape-md);
  min-width: 56px;
}
.ii-timer__value { font-size: 1.5rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.ii-timer__label { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-timer__sep { font-size: 1.5rem; font-weight: 700; color: var(--ii-on-surface-variant); }

/* --- TreeView --- */
.ii-tree { list-style: none; padding: 0; }
.ii-tree__item { }
.ii-tree__node {
  display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: var(--ii-shape-sm);
  cursor: pointer; font-size: var(--ii-font-sm); color: var(--ii-on-surface);
  transition: background var(--ii-transition);
}
.ii-tree__node:hover { background: var(--ii-surface-container); }
.ii-tree__node--selected { background: color-mix(in srgb, var(--ii-primary) 12%, var(--ii-surface)); color: var(--ii-primary); }
.ii-tree__toggle { background: none; border: none; cursor: pointer; font-size: 0.6rem; color: var(--ii-on-surface-variant); width: 16px; }
.ii-tree__icon { font-size: 1rem; }
.ii-tree__children { padding-left: 20px; }

/* --- Divider --- */
.ii-divider { border: none; border-top: 1px solid var(--ii-outline-variant); margin: var(--ii-spacing-4) 0; }
.ii-divider--vertical { border-top: none; border-left: 1px solid var(--ii-outline-variant); margin: 0 var(--ii-spacing-4); height: auto; align-self: stretch; }

/* --- Kbd --- */
.ii-kbd {
  display: inline-flex; align-items: center; padding: 2px 6px; border: 1px solid var(--ii-outline-variant);
  border-radius: 4px; background: var(--ii-surface-container); font-family: 'Fira Code', monospace;
  font-size: 0.75rem; font-weight: 500; color: var(--ii-on-surface);
  box-shadow: 0 1px 0 var(--ii-outline-variant);
}

/* --- Toolbar --- */
.ii-toolbar { display: flex; align-items: center; gap: 4px; padding: 4px; background: var(--ii-surface-container); border-radius: var(--ii-shape-md); }
.ii-toolbar__btn {
  display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;
  border: none; background: transparent; border-radius: var(--ii-shape-sm);
  cursor: pointer; color: var(--ii-on-surface); transition: background var(--ii-transition);
}
.ii-toolbar__btn:hover { background: var(--ii-surface-container-high); }
.ii-toolbar__btn--active { background: var(--ii-primary-container); color: var(--ii-primary); }
.ii-toolbar__sep { width: 1px; height: 24px; background: var(--ii-outline-variant); margin: 0 4px; }

/* --- PricingCard --- */
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

/* --- AuthForm --- */
.ii-auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--ii-spacing-6);
}
.ii-auth-form__title {
  font-size: var(--ii-font-xl);
  font-weight: 700;
  color: var(--ii-on-surface);
  margin: 0 0 var(--ii-spacing-6);
  text-align: center;
}
.ii-auth-form__providers {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-2);
  margin-bottom: var(--ii-spacing-4);
}
.ii-auth-form__provider-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ii-spacing-2);
  padding: 10px 16px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  cursor: pointer;
  transition: background var(--ii-transition), border-color var(--ii-transition);
}
.ii-auth-form__provider-btn:hover {
  background: var(--ii-surface-container);
  border-color: var(--ii-outline);
}
.ii-auth-form__provider-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ii-auth-form__divider {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  margin: var(--ii-spacing-3) 0;
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-sm);
}
.ii-auth-form__divider::before,
.ii-auth-form__divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--ii-outline-variant);
}
.ii-auth-form form {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-4);
}
.ii-auth-form__error {
  padding: var(--ii-spacing-3);
  background: color-mix(in srgb, var(--ii-error) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--ii-error) 30%, transparent);
  border-radius: var(--ii-shape-sm);
  color: var(--ii-error);
  font-size: var(--ii-font-sm);
}
.ii-auth-form__submit {
  width: 100%;
  margin-top: var(--ii-spacing-2);
}
.ii-auth-form__switch {
  text-align: center;
  margin-top: var(--ii-spacing-4);
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-auth-form__switch-btn {
  background: none;
  border: none;
  color: var(--ii-primary);
  font-weight: 600;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  padding: 0;
}
.ii-auth-form__switch-btn:hover {
  text-decoration: underline;
}

/* --- SettingsSection --- */
.ii-settings-section {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--ii-spacing-6);
  padding: var(--ii-spacing-6) 0;
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-settings-section:last-child {
  border-bottom: none;
}
.ii-settings-section__title {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
  margin: 0 0 var(--ii-spacing-1);
}
.ii-settings-section__desc {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin: 0;
}
.ii-settings-section__content {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-4);
}
.ii-settings-section__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ii-spacing-4);
}
@media (max-width: 768px) {
  .ii-settings-section {
    grid-template-columns: 1fr;
    gap: var(--ii-spacing-3);
  }
}

/* --- ErrorPage --- */
.ii-error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--ii-spacing-6);
  background: var(--ii-surface);
}
.ii-error-page__inner {
  text-align: center;
  max-width: 480px;
}
.ii-error-page__code {
  font-size: 6rem;
  font-weight: 800;
  color: var(--ii-primary);
  line-height: 1;
  opacity: 0.3;
}
.ii-error-page__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ii-on-surface);
  margin: var(--ii-spacing-2) 0;
}
.ii-error-page__desc {
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
  margin: 0 0 var(--ii-spacing-6);
}

/* --- UserMenu --- */
.ii-user-menu {
  position: relative;
}
.ii-user-menu__trigger {
  display: flex;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: box-shadow var(--ii-transition);
}
.ii-user-menu__trigger:hover {
  box-shadow: 0 0 0 2px var(--ii-outline-variant);
}
.ii-user-menu__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}
.ii-user-menu__avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ii-primary-container);
  color: var(--ii-on-primary-container);
  font-size: var(--ii-font-sm);
  font-weight: 600;
}
.ii-user-menu__dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 220px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-lg);
  padding: var(--ii-spacing-1) 0;
  z-index: 50;
  animation: ii-fade-in 0.15s ease;
}
.ii-user-menu__info {
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-user-menu__name {
  display: block;
  font-size: var(--ii-font-base);
  font-weight: 600;
  color: var(--ii-on-surface);
}
.ii-user-menu__email {
  display: block;
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin-top: 2px;
}
.ii-user-menu__item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  width: 100%;
  padding: var(--ii-spacing-2) var(--ii-spacing-4);
  border: none;
  background: none;
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  cursor: pointer;
  text-align: left;
  transition: background var(--ii-transition);
}
.ii-user-menu__item:hover {
  background: var(--ii-surface-container-high);
}
.ii-user-menu__divider {
  margin: var(--ii-spacing-1) 0;
  border: none;
  border-top: 1px solid var(--ii-outline-variant);
}

/* --- Charts --- */
.ii-chart {
  position: relative;
  width: 100%;
}
.ii-chart svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Bar Chart */
.ii-chart-bar__bar {
  fill: var(--ii-primary);
  transition: opacity var(--ii-transition);
  animation: ii-chart-grow-up 0.6s ease forwards;
  transform-origin: bottom;
}
.ii-chart-bar__bar:hover {
  opacity: 0.8;
}
.ii-chart-bar__label {
  font-size: 11px;
  fill: var(--ii-on-surface-variant);
  text-anchor: middle;
}
.ii-chart-bar__value {
  font-size: 11px;
  fill: var(--ii-on-surface);
  text-anchor: middle;
  font-weight: 500;
}

/* Line Chart */
.ii-chart-line__line {
  fill: none;
  stroke: var(--ii-primary);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ii-chart-line__area {
  fill: var(--ii-primary);
  opacity: 0.1;
}
.ii-chart-line__dot {
  fill: var(--ii-primary);
  stroke: var(--ii-surface);
  stroke-width: 2;
  transition: r var(--ii-transition);
}
.ii-chart-line__dot:hover {
  r: 6;
}
.ii-chart-line__grid {
  stroke: var(--ii-outline-variant);
  stroke-width: 0.5;
  stroke-dasharray: 4 4;
}
.ii-chart-line__axis-label {
  font-size: 11px;
  fill: var(--ii-on-surface-variant);
}

/* Donut Chart */
.ii-chart-donut__segment {
  transition: opacity var(--ii-transition);
  animation: ii-chart-donut-draw 0.8s ease forwards;
  stroke-dashoffset: var(--ii-donut-offset, 0);
}
.ii-chart-donut__segment:hover {
  opacity: 0.8;
}
.ii-chart-donut__center-value {
  font-size: 1.5rem;
  font-weight: 700;
  fill: var(--ii-on-surface);
  text-anchor: middle;
  dominant-baseline: central;
}
.ii-chart-donut__center-label {
  font-size: 0.75rem;
  fill: var(--ii-on-surface-variant);
  text-anchor: middle;
}
.ii-chart-donut__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ii-spacing-3);
  margin-top: var(--ii-spacing-3);
  justify-content: center;
}
.ii-chart-donut__legend-item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-1);
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-chart-donut__legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* SparkLine */
.ii-sparkline {
  display: inline-block;
}
.ii-sparkline__line {
  fill: none;
  stroke: var(--ii-primary);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ii-sparkline--success .ii-sparkline__line { stroke: var(--ii-success); }
.ii-sparkline--error .ii-sparkline__line { stroke: var(--ii-error); }

/* Chart Tooltip */
.ii-chart-tooltip {
  position: absolute;
  background: var(--ii-on-surface);
  color: var(--ii-surface);
  padding: 4px 8px;
  border-radius: var(--ii-shape-sm);
  font-size: var(--ii-font-sm);
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  animation: ii-fade-in 0.1s ease;
}
.ii-chart-tooltip::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--ii-on-surface);
}

/* Chart animations */
@keyframes ii-chart-grow-up {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
@keyframes ii-chart-donut-draw {
  from { stroke-dashoffset: var(--ii-donut-circumference, 0); }
  to { stroke-dashoffset: var(--ii-donut-offset, 0); }
}

/* --- Notification Item --- */
.ii-notification-list {
  display: flex;
  flex-direction: column;
}
.ii-notification-item {
  display: flex;
  gap: var(--ii-spacing-3);
  padding: var(--ii-spacing-4);
  border-bottom: 1px solid var(--ii-outline-variant);
  transition: background var(--ii-transition);
}
.ii-notification-item:last-child {
  border-bottom: none;
}
.ii-notification-item:hover {
  background: var(--ii-surface-container);
}
.ii-notification-item--unread {
  background: color-mix(in srgb, var(--ii-primary) 5%, transparent);
}
.ii-notification-item__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ii-surface-container-high);
  color: var(--ii-primary);
}
.ii-notification-item__content {
  flex: 1;
  min-width: 0;
}
.ii-notification-item__title {
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface);
  margin-bottom: 2px;
}
.ii-notification-item__body {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin-bottom: 4px;
}
.ii-notification-item__time {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  opacity: 0.7;
}
.ii-notification-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ii-primary);
  flex-shrink: 0;
  margin-top: 6px;
}

/* Blog components */
.ii-blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--ii-spacing-6);
}
.ii-blog-card {
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  overflow: hidden;
  transition: box-shadow var(--ii-transition);
  background: var(--ii-surface);
}
.ii-blog-card:hover {
  box-shadow: var(--ii-shadow-md);
}
.ii-blog-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--ii-surface-container);
}
.ii-blog-card__body {
  padding: var(--ii-spacing-4);
}
.ii-blog-card__tags {
  display: flex;
  gap: var(--ii-spacing-1);
  margin-bottom: var(--ii-spacing-2);
}
.ii-blog-card__title {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
  margin: 0 0 var(--ii-spacing-2);
}
.ii-blog-card__title a {
  text-decoration: none;
  color: inherit;
}
.ii-blog-card__title a:hover {
  color: var(--ii-primary);
}
.ii-blog-card__excerpt {
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
  margin: 0 0 var(--ii-spacing-3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ii-blog-card__meta {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-blog-card__author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

/* Blog layout (article detail) */
.ii-blog-article {
  max-width: 720px;
  margin: 0 auto;
  padding: 60px var(--ii-spacing-6);
}
.ii-blog-article__header {
  margin-bottom: var(--ii-spacing-6);
}
.ii-blog-article__title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 var(--ii-spacing-3);
}
.ii-blog-article__meta {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
}
.ii-blog-article__cover {
  width: 100%;
  border-radius: var(--ii-shape-lg);
  margin-bottom: var(--ii-spacing-6);
}

/* LP Footer structure */
.ii-lp-footer__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ii-spacing-4);
}
.ii-lp-footer__nav {
  display: flex;
  gap: var(--ii-spacing-4);
}
.ii-lp-footer__nav a {
  color: inherit;
  text-decoration: none;
}
.ii-lp-footer__nav a:hover {
  color: var(--ii-primary);
}

/* --- Admin Page Structure --- */
.ii-admin-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--ii-spacing-6);
}
.ii-admin-page__header-left {
  display: flex;
  flex-direction: column;
}
.ii-admin-page__title {
  font-size: var(--ii-font-xl);
  font-weight: 600;
  color: var(--ii-on-surface);
  margin: 0;
}
.ii-admin-page__desc {
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
  margin: var(--ii-spacing-1) 0 0;
}
.ii-admin-page__actions {
  display: flex;
  gap: var(--ii-spacing-2);
  align-items: center;
}

/* Stat grid */
.ii-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--ii-spacing-4);
  margin-bottom: var(--ii-spacing-6);
}

/* Placeholder box */
.ii-placeholder {
  background: var(--ii-surface-container);
  border-radius: var(--ii-shape-md);
  padding: 48px;
  text-align: center;
  color: var(--ii-on-surface-variant);
}
.ii-placeholder__icon {
  margin-bottom: var(--ii-spacing-3);
}
.ii-placeholder__text {
  font-size: var(--ii-font-base);
}
.ii-placeholder__sub {
  font-size: var(--ii-font-sm);
  margin-top: var(--ii-spacing-1);
}
/* --- Admin Shell Layout --- */
.ii-admin-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Rail */
.ii-admin-rail {
  width: 56px;
  background: var(--ii-surface);
  border-right: 1px solid var(--ii-outline-variant);
  display: flex;
  flex-direction: column;
  transition: width var(--ii-transition);
  overflow: hidden;
  flex-shrink: 0;
  z-index: 10;
}
.ii-admin-rail--expanded {
  width: 220px;
}
.ii-admin-rail__items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--ii-spacing-2);
}
.ii-admin-rail__item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  padding: var(--ii-spacing-3);
  border-radius: var(--ii-shape-sm);
  text-decoration: none;
  color: var(--ii-on-surface-variant);
  white-space: nowrap;
  transition: background var(--ii-transition), color var(--ii-transition);
}
.ii-admin-rail__item:hover {
  background: var(--ii-surface-container-high);
  color: var(--ii-on-surface);
}
.ii-admin-rail__item--active {
  background: var(--ii-primary-container);
  color: var(--ii-on-primary-container);
  font-weight: 500;
}
.ii-admin-rail__icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}
.ii-admin-rail__label {
  font-size: var(--ii-font-base);
  opacity: 0;
  transition: opacity var(--ii-transition);
}
.ii-admin-rail--expanded .ii-admin-rail__label {
  opacity: 1;
}

/* Main */
.ii-admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Header */
.ii-admin-header {
  height: 56px;
  padding: 0 var(--ii-spacing-6);
  border-bottom: 1px solid var(--ii-outline-variant);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.ii-admin-header__brand {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
}
.ii-admin-header__actions {
  display: flex;
  gap: var(--ii-spacing-2);
}

/* Content */
.ii-admin-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--ii-spacing-6);
}

/* --- AdminShell Mobile --- */
.ii-admin-header__hamburger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: var(--ii-on-surface);
  cursor: pointer;
  border-radius: var(--ii-shape-sm);
}
.ii-admin-header__hamburger:hover {
  background: var(--ii-surface-container-high);
}
.ii-admin-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}
.ii-admin-overlay--open { display: block; }
@media (max-width: 768px) {
  .ii-admin-rail--mobile-open {
    display: flex;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 260px;
    z-index: 100;
    box-shadow: var(--ii-shadow-lg);
  }
  .ii-admin-rail--mobile-open .ii-admin-rail__label { opacity: 1; }
}

/* --- Auth Page --- */
.ii-auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--ii-spacing-6);
}
.ii-auth-page__brand {
  margin-bottom: var(--ii-spacing-6);
  font-size: var(--ii-font-2xl);
  font-weight: 700;
  text-decoration: none;
  color: var(--ii-primary);
}

/* --- Legal Page --- */
.ii-legal-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 60px var(--ii-spacing-6);
}
.ii-legal-page h1 {
  font-size: var(--ii-font-2xl);
  font-weight: 700;
  margin-bottom: var(--ii-spacing-2);
}
.ii-legal-page__date {
  color: var(--ii-on-surface-variant);
  margin-bottom: var(--ii-spacing-6);
}
.ii-legal-page h2 {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  margin: var(--ii-spacing-6) 0 var(--ii-spacing-2);
}
.ii-legal-page p {
  margin-bottom: var(--ii-spacing-3);
  line-height: 1.7;
}
.ii-legal-page ul {
  padding-left: var(--ii-spacing-6);
  margin-bottom: var(--ii-spacing-3);
}
.ii-legal-page li {
  margin-bottom: var(--ii-spacing-1);
}
.ii-legal-page a {
  color: var(--ii-primary);
}

/* ======================================
   in-it Core CSS
   ====================================== */

/* ================================================================
 * LAYOUT: Landing Page
 * ================================================================ */

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
.ii-lp-features__card { padding: 32px; border-radius: var(--ii-shape-lg); border: 1px solid var(--ii-outline-variant); background: var(--ii-surface); transition: all var(--ii-transition); }
.ii-lp-features__card:hover { border-color: var(--ii-primary); box-shadow: var(--ii-shadow-md); transform: translateY(-2px); }
.ii-lp-features__card-icon { font-size: 2rem; margin-bottom: 16px; }
.ii-lp-features__card-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 8px; }
.ii-lp-features__card-desc { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); line-height: 1.6; }

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

/* ================================================================
 * LAYOUT: Docs
 * ================================================================ */

.ii-docs-shell { display: flex; flex-direction: column; min-height: 100vh; }
.ii-docs-header { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--ii-surface) 90%, transparent); backdrop-filter: blur(12px); border-bottom: 1px solid var(--ii-outline-variant); }
.ii-docs-header__inner { max-width: 1400px; margin: 0 auto; padding: 10px 24px; display: flex; align-items: center; justify-content: space-between; }
.ii-docs-header__brand { font-weight: 700; font-size: 1.125rem; text-decoration: none; color: var(--ii-on-surface); }
.ii-docs-header__nav { display: flex; align-items: center; gap: 20px; }
.ii-docs-header__link { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); text-decoration: none; }
.ii-docs-header__link:hover { color: var(--ii-primary); }

.ii-docs-body { display: flex; flex: 1; max-width: 1400px; margin: 0 auto; width: 100%; }

.ii-docs-sidebar { width: 260px; flex-shrink: 0; padding: 24px 16px; border-right: 1px solid var(--ii-outline-variant); overflow-y: auto; position: sticky; top: 49px; height: calc(100vh - 49px); }
.ii-docs-sidebar__group { margin-bottom: 20px; }
.ii-docs-sidebar__group-label { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ii-on-surface-variant); margin-bottom: 8px; padding: 0 12px; }
.ii-docs-sidebar__link { display: block; padding: 6px 12px; border-radius: var(--ii-shape-sm); font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); text-decoration: none; transition: all var(--ii-transition); }
.ii-docs-sidebar__link:hover { background: var(--ii-surface-container); color: var(--ii-on-surface); }
.ii-docs-sidebar__link--active { background: color-mix(in srgb, var(--ii-primary) 12%, var(--ii-surface)); color: var(--ii-primary); font-weight: 500; }

.ii-docs-content { flex: 1; min-width: 0; padding: 32px 48px; max-width: 800px; }

.ii-docs-toc { width: 200px; flex-shrink: 0; padding: 24px 16px; position: sticky; top: 49px; height: calc(100vh - 49px); overflow-y: auto; }
.ii-docs-toc__title { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ii-on-surface-variant); margin-bottom: 12px; }
.ii-docs-toc__link { display: block; padding: 4px 0; font-size: 0.8125rem; color: var(--ii-on-surface-variant); text-decoration: none; border-left: 2px solid transparent; padding-left: 12px; transition: all var(--ii-transition); }
.ii-docs-toc__link:hover { color: var(--ii-on-surface); }
.ii-docs-toc__link--active { color: var(--ii-primary); border-left-color: var(--ii-primary); }
.ii-docs-toc__link--h3 { padding-left: 24px; }

/* Docs article typography */
.ii-docs-article { line-height: 1.7; color: var(--ii-on-surface); }
.ii-docs-article h1 { font-size: 2rem; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.02em; }
.ii-docs-article h2 { font-size: 1.5rem; font-weight: 600; margin-top: 48px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--ii-outline-variant); }
.ii-docs-article h3 { font-size: 1.25rem; font-weight: 600; margin-top: 32px; margin-bottom: 12px; }
.ii-docs-article p { margin-bottom: 16px; }
.ii-docs-article code { padding: 2px 6px; border-radius: 4px; background: var(--ii-surface-container); font-family: monospace; font-size: 0.875em; }
.ii-docs-article pre { padding: 16px; border-radius: var(--ii-shape-md); background: var(--ii-surface-container); overflow-x: auto; margin-bottom: 24px; }
.ii-docs-article pre code { padding: 0; background: none; }
.ii-docs-article ul, .ii-docs-article ol { margin-bottom: 16px; padding-left: 24px; }
.ii-docs-article li { margin-bottom: 8px; }
.ii-docs-article table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
.ii-docs-article th { text-align: left; padding: 8px 12px; border-bottom: 2px solid var(--ii-outline-variant); font-weight: 600; font-size: var(--ii-font-sm); }
.ii-docs-article td { padding: 8px 12px; border-bottom: 1px solid var(--ii-outline-variant); font-size: var(--ii-font-sm); }
.ii-docs-article blockquote { padding: 12px 16px; border-left: 4px solid var(--ii-primary); background: color-mix(in srgb, var(--ii-primary) 4%, var(--ii-surface)); border-radius: 0 var(--ii-shape-sm) var(--ii-shape-sm) 0; margin-bottom: 16px; }
.ii-docs-article a { color: var(--ii-primary); text-decoration: underline; text-underline-offset: 2px; }
.ii-docs-article img { max-width: 100%; border-radius: var(--ii-shape-md); }

/* Aside/Callout (Note, Tip, Caution, Danger) */
.ii-aside { padding: 16px; border-radius: var(--ii-shape-md); margin-bottom: 24px; border-left: 4px solid; }
.ii-aside__title { font-weight: 600; font-size: var(--ii-font-sm); margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.ii-aside__body { font-size: var(--ii-font-sm); line-height: 1.6; }
.ii-aside--note { border-left-color: var(--ii-info); background: color-mix(in srgb, var(--ii-info) 6%, var(--ii-surface)); }
.ii-aside--tip { border-left-color: var(--ii-success); background: color-mix(in srgb, var(--ii-success) 6%, var(--ii-surface)); }
.ii-aside--caution { border-left-color: var(--ii-warning); background: color-mix(in srgb, var(--ii-warning) 6%, var(--ii-surface)); }
.ii-aside--danger { border-left-color: var(--ii-error); background: color-mix(in srgb, var(--ii-error) 6%, var(--ii-surface)); }

/* Prev/Next navigation */
.ii-docs-pager { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--ii-outline-variant); }
.ii-docs-pager__link { display: flex; flex-direction: column; gap: 4px; padding: 16px; border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-md); text-decoration: none; transition: all var(--ii-transition); }
.ii-docs-pager__link:hover { border-color: var(--ii-primary); }
.ii-docs-pager__link--next { text-align: right; }
.ii-docs-pager__label { font-size: 0.6875rem; color: var(--ii-on-surface-variant); text-transform: uppercase; }
.ii-docs-pager__title { font-weight: 600; color: var(--ii-primary); }

/* Responsive */
@media (max-width: 1024px) {
  .ii-docs-toc { display: none; }
  .ii-docs-content { padding: 24px; max-width: 100%; }
}
@media (max-width: 768px) {
  .ii-docs-sidebar { display: none; }
  .ii-lp-hero__headline { font-size: 2rem; }
  .ii-lp-features__grid { grid-template-columns: 1fr; }
  .ii-admin-rail { display: none; }
  .ii-admin-header__hamburger { display: flex; }
  .ii-pricing-grid { grid-template-columns: 1fr; }
}
`;

let injected = false;

/**
 * Inject all in-it CSS into the document head.
 * Safe to call multiple times — only injects once.
 */
export function injectStyles(): void {
  if (injected) return;
  if (typeof document === "undefined") return;
  injected = true;
  const style = document.createElement("style");
  style.id = "ii-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
}

/**
 * Component that injects in-it CSS on first render.
 * Place once at the top of your app.
 */
export function StyleSheet(): null {
  injectStyles();
  return null;
}
