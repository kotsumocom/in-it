/**
 * @module
 * in-it — Hono-only dependency SaaS starter framework for Deno/Bun.
 *
 * Provides HCT color system, WAI-ARIA accessible components,
 * MD3 theming, built-in icons (derived from Tabler Icons), SPA router,
 * and markdown parser.
 *
 * @example Basic usage
 * ```ts
 * import { HctColor, generateScheme, Button, Card } from "@kotsumo/in-it";
 *
 * // Generate a color scheme from a hex color
 * const { light, dark } = generateScheme("#6750a4");
 *
 * // Use HCT color directly
 * const color = HctColor.fromHex("#6750a4");
 * console.log(color.withTone(80).toHex());
 * ```
 */

export * from "./components/mod.ts";
export * from "./color/hct.ts";
export * from "./color/scheme.ts";
export * from "./color/presets.ts";
export { parseMarkdown, tocToDocsFormat } from "./docs/markdown.ts";
export type { MarkdownMeta, TocItem, ParsedMarkdown } from "./docs/markdown.ts";
export { Route, Switch, Link, useLocation } from "./router.tsx";
export { Icon, iconSvg } from "./icons/Icon.tsx";
export type { IconProps } from "./icons/Icon.tsx";
export { ICON_PATHS } from "./icons/paths.ts";
export { FILLED_ICON_PATHS } from "./icons/filled.ts";
export { BarChart, LineChart, DonutChart, SparkLine } from "./components/charts/mod.ts";
export type { BarChartProps, LineChartProps, DonutChartProps, DonutSegment, SparkLineProps } from "./components/charts/mod.ts";
