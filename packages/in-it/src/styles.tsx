/**
 * @module styles
 * Aggregates all component CSS for one-shot injection.
 *
 * Import each component's co-located CSS constant and combine them
 * with the base CSS (variables, reset, icon, animations).
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

// --- Base ---
import { BASE_CSS } from "./base-css.ts";

// --- UI Components ---
import { BUTTON_CSS } from "./components/ui/Button.tsx";
import { BADGE_CSS } from "./components/ui/Badge.tsx";
import { CARD_CSS } from "./components/ui/Card.tsx";
import { STAT_CARD_CSS } from "./components/ui/StatCard.tsx";
import { DATA_TABLE_CSS } from "./components/ui/DataTable.tsx";
import { INPUT_CSS } from "./components/ui/Input.tsx";
import { TEXTAREA_CSS } from "./components/ui/Textarea.tsx";
import { AVATAR_CSS } from "./components/ui/Avatar.tsx";
import { CHIP_CSS } from "./components/ui/Chip.tsx";
import { SKELETON_CSS } from "./components/ui/Skeleton.tsx";
import { EMPTY_STATE_CSS } from "./components/ui/EmptyState.tsx";
import { PROGRESS_CSS } from "./components/ui/Progress.tsx";
import { ALERT_CSS } from "./components/ui/Alert.tsx";
import { KBD_CSS } from "./components/ui/Kbd.tsx";
import { BREADCRUMB_CSS } from "./components/ui/Breadcrumb.tsx";
import { DIVIDER_CSS } from "./components/ui/Divider.tsx";
import { BLOG_CSS } from "./components/ui/Blog.tsx";
import { ERROR_PAGE_CSS } from "./components/ui/ErrorPage.tsx";
import { PRICING_CARD_CSS } from "./components/ui/PricingCard.tsx";
import { SETTINGS_SECTION_CSS } from "./components/ui/SettingsSection.tsx";
import { SECTION_CSS } from "./components/ui/Aside.tsx";

// --- Interactive Components ---
import { SWITCH_CSS } from "./components/interactive/Switch.tsx";
import { DIALOG_CSS } from "./components/interactive/Dialog.tsx";
import { TABS_CSS } from "./components/interactive/Tabs.tsx";
import { MENU_CSS } from "./components/interactive/Menu.tsx";
import { TOAST_CSS } from "./components/interactive/Toast.tsx";
import { SELECT_CSS } from "./components/interactive/Select.tsx";
import { ACCORDION_CSS } from "./components/interactive/Accordion.tsx";
import { POPOVER_CSS } from "./components/interactive/Popover.tsx";
import { TOOLTIP_CSS } from "./components/interactive/Tooltip.tsx";
import { SLIDER_CSS } from "./components/interactive/Slider.tsx";
import { CHECKBOX_CSS } from "./components/interactive/Checkbox.tsx";
import { RADIO_GROUP_CSS } from "./components/interactive/RadioGroup.tsx";
import { PAGINATION_CSS } from "./components/interactive/Pagination.tsx";
import { COMBOBOX_CSS } from "./components/interactive/Combobox.tsx";
import { DRAWER_CSS } from "./components/interactive/Drawer.tsx";
import { STEPS_CSS } from "./components/interactive/Steps.tsx";
import { THEME_TOGGLE_CSS } from "./components/interactive/ThemeToggle.tsx";
import { USER_MENU_CSS } from "./components/interactive/UserMenu.tsx";
import { AUTH_FORM_CSS } from "./components/interactive/AuthForm.tsx";

// --- Charts ---
import { CHART_SHARED_CSS } from "./components/charts/chart-css.ts";
import { BAR_CHART_CSS } from "./components/charts/BarChart.tsx";
import { LINE_CHART_CSS } from "./components/charts/LineChart.tsx";
import { DONUT_CHART_CSS } from "./components/charts/DonutChart.tsx";
import { SPARK_LINE_CSS } from "./components/charts/SparkLine.tsx";

// --- Layout ---
import { LANDING_CSS } from "./components/layout/Landing.tsx";
import { DOCS_CSS } from "./components/layout/DocsShell.tsx";

// --- Admin ---
import { ADMIN_SHELL_CSS, ADMIN_SHELL_MOBILE_CSS } from "./components/admin/AdminShell.tsx";

/** All in-it CSS as a string */
export const CSS = [
  BASE_CSS,
  // UI
  BUTTON_CSS,
  BADGE_CSS,
  CARD_CSS,
  STAT_CARD_CSS,
  DATA_TABLE_CSS,
  INPUT_CSS,
  TEXTAREA_CSS,
  AVATAR_CSS,
  CHIP_CSS,
  SKELETON_CSS,
  EMPTY_STATE_CSS,
  PROGRESS_CSS,
  ALERT_CSS,
  KBD_CSS,
  BREADCRUMB_CSS,
  DIVIDER_CSS,
  BLOG_CSS,
  ERROR_PAGE_CSS,
  PRICING_CARD_CSS,
  SETTINGS_SECTION_CSS,
  SECTION_CSS,
  // Interactive
  SWITCH_CSS,
  DIALOG_CSS,
  TABS_CSS,
  MENU_CSS,
  TOAST_CSS,
  SELECT_CSS,
  ACCORDION_CSS,
  POPOVER_CSS,
  TOOLTIP_CSS,
  SLIDER_CSS,
  CHECKBOX_CSS,
  RADIO_GROUP_CSS,
  PAGINATION_CSS,
  COMBOBOX_CSS,
  DRAWER_CSS,
  STEPS_CSS,
  THEME_TOGGLE_CSS,
  USER_MENU_CSS,
  AUTH_FORM_CSS,
  // Charts
  CHART_SHARED_CSS,
  BAR_CHART_CSS,
  LINE_CHART_CSS,
  DONUT_CHART_CSS,
  SPARK_LINE_CSS,
  // Layout
  LANDING_CSS,
  DOCS_CSS,
  // Admin
  ADMIN_SHELL_CSS,
  ADMIN_SHELL_MOBILE_CSS,
].join("\n");

/**
 * Inject all in-it CSS into the document head.
 * Call once at application startup. Safe to call multiple times
 * (subsequent calls are no-ops).
 */
export function injectStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById("ii-styles")) return;
  const style = document.createElement("style");
  style.id = "ii-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
}

/**
 * SSR-compatible `<style>` tag component.
 * Use in your layout's `<head>` to inline all in-it CSS.
 *
 * @example
 * ```tsx
 * <html>
 *   <head>
 *     <StyleSheet />
 *   </head>
 *   <body>
 *     <App />
 *   </body>
 * </html>
 * ```
 */
export function StyleSheet(): any {
  return (
    <style id="ii-styles" dangerouslySetInnerHTML={{ __html: CSS }} />
  );
}
