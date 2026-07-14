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
 *   overrides: {
 *     Button: "./client/overrides/Button.tsx",
 *     AdminShell: "./client/overrides/AdminShell.tsx",
 *   },
 * });
 * ```
 */

/** All overridable component names exported by in-it. */
export type OverridableComponent =
  // UI
  | "Badge" | "Card" | "Button" | "StatCard" | "DataTable" | "Input"
  | "Avatar" | "Chip" | "Skeleton" | "EmptyState"
  | "Textarea" | "Alert" | "Progress" | "ProgressCircular"
  | "Breadcrumb" | "Divider" | "Kbd" | "Aside"
  | "PricingCard" | "SettingsSection" | "ErrorPage"
  | "BlogCard" | "BlogGrid" | "BlogArticle"
  // Interactive
  | "Switch" | "Dialog" | "Tabs" | "Menu" | "ToastContainer"
  | "Select" | "Accordion" | "Popover" | "ThemeToggle"
  | "Combobox" | "Checkbox" | "RadioGroup" | "Drawer"
  | "Slider" | "Pagination" | "Steps" | "Tooltip"
  | "AuthForm" | "UserMenu"
  // Layout
  | "AdminShell" | "DocsShell"
  | "LandingHeader" | "LandingHero" | "LandingFeatures"
  | "LandingSection" | "LandingFooter"
  // Charts
  | "BarChart" | "LineChart" | "DonutChart" | "SparkLine";

/** in-it project configuration. */
export interface InItConfig {
  /**
   * Component overrides.
   * Map component names to file paths relative to the project root.
   *
   * @example
   * ```ts
   * overrides: {
   *   Button: "./client/overrides/Button.tsx",
   * }
   * ```
   */
  overrides?: Partial<Record<OverridableComponent, string>>;
}

/** Type-safe config helper. */
export function defineConfig(config: InItConfig): InItConfig {
  return config;
}
