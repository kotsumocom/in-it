/**
 * @module config
 * Configuration types for in-it projects.
 *
 * @example
 * ```ts
 * // in-it.config.ts
 * import { defineConfig } from "@kotsumo/in-it/config";
 *
 * export default defineConfig({
 *   site: { name: "My SaaS", lang: "ja" },
 *   theme: { primary: "#ff5722" },
 *   icons: "filled",
 *   overrides: {
 *     Button: "./client/overrides/Button.tsx",
 *   },
 * });
 * ```
 */

import type { Locale } from "./locale.ts";

/** All overridable component names exported by in-it. */
export type OverridableComponent =
  | "Badge" | "Card" | "Button" | "StatCard" | "DataTable" | "Input"
  | "Avatar" | "Chip" | "Skeleton" | "EmptyState"
  | "Textarea" | "Alert" | "Progress" | "ProgressCircular"
  | "Breadcrumb" | "Divider" | "Kbd" | "Aside"
  | "PricingCard" | "SettingsSection" | "ErrorPage"
  | "BlogCard" | "BlogGrid" | "BlogArticle"
  | "Switch" | "Dialog" | "Tabs" | "Menu" | "ToastContainer"
  | "Select" | "Accordion" | "Popover" | "ThemeToggle"
  | "Combobox" | "Checkbox" | "RadioGroup" | "Drawer"
  | "Slider" | "Pagination" | "Steps" | "Tooltip"
  | "AuthForm" | "UserMenu"
  | "AdminShell" | "DocsShell"
  | "LandingHeader" | "LandingHero" | "LandingFeatures"
  | "LandingSection" | "LandingFooter"
  | "BarChart" | "LineChart" | "DonutChart" | "SparkLine";

/** Site metadata. */
export interface SiteConfig {
  /** Site/app name. Default: "My SaaS" */
  name?: string;
  /** HTML lang attribute. Default: "ja" */
  lang?: string;
  /** Meta description. Default: "" */
  description?: string;
}

/** Theme configuration. */
export interface ThemeConfig {
  /** Primary seed color (hex). HCT color scheme is auto-generated. Default: "#6750a4" */
  primary?: string;
  /** Default theme mode. Default: "system" */
  defaultMode?: "light" | "dark" | "system";
}

/** Auth provider declaration (metadata only — does not generate code). */
export interface AuthConfig {
  /** Auth provider name. Informational only. */
  provider?: "supabase" | "auth0" | "clerk" | "firebase" | "custom";
}

/** in-it project configuration. */
export interface InItConfig {
  /** Site metadata (name, lang, description). */
  site?: SiteConfig;

  /** Theme color configuration. */
  theme?: ThemeConfig;

  /**
   * Icon style.
   * @default "outlined"
   */
  icons?: "outlined" | "filled";

  /**
   * UI locale for built-in component strings.
   * "ja" enables Japanese UI, CJK font optimization, and adjusted typography.
   * @default "en"
   */
  locale?: Locale;

  /**
   * Auth provider declaration (metadata only — no code generated).
   * Serves as documentation for AI/LLM and developers.
   */
  auth?: AuthConfig;

  /**
   * Component overrides.
   * Map component names to file paths relative to the project root.
   */
  overrides?: Partial<Record<OverridableComponent, string>>;
}

/** Default configuration values. */
export const defaults = {
  site: { name: "My SaaS", lang: "ja", description: "" },
  theme: { primary: "#6750a4", defaultMode: "system" },
  icons: "outlined" as const,
  locale: "en" as Locale,
} satisfies { site: Required<SiteConfig>; theme: Required<ThemeConfig>; icons: "outlined" | "filled"; locale: Locale };

let activeConfig: InItConfig = { ...defaults };

/** Set the active configuration (called during startup). */
export function setConfig(config: InItConfig): void {
  activeConfig = {
    ...defaults,
    ...config,
    site: { ...defaults.site, ...config.site },
    theme: { ...defaults.theme, ...config.theme },
  };

  // Apply theme immediately to prevent flash
  if (typeof document !== "undefined") {
    const mode = activeConfig.theme?.defaultMode ?? "system";
    const resolved = mode === "system"
      ? (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light")
      : mode;
    document.documentElement.setAttribute("data-theme", resolved);
  }
}

/** Get the currently active configuration. */
export function getConfig(): InItConfig {
  return activeConfig;
}

/** Type-safe config helper. */
export function defineConfig(config: InItConfig): InItConfig {
  return config;
}
