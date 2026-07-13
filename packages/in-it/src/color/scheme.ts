/**
 * @module color/scheme
 * MD3 Color Scheme Generation.
 * Maps HCT colors to Material Design 3 compatible tone tokens.
 *
 * @example
 * ```ts
 * import { generateScheme, generateCss } from "@kotsumo/in-it/color/scheme";
 *
 * const { light, dark } = generateScheme("#6750a4");
 * console.log(light.primary); // hex color
 *
 * // Generate CSS custom properties
 * const css = generateCss("#6750a4");
 * ```
 */
import { HctColor } from "./hct.ts";

/** Color scheme tokens */
export interface ColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
}

/** Generate light/dark scheme from source color */
export function generateScheme(sourceHex: string): { light: ColorScheme; dark: ColorScheme } {
  const source = HctColor.fromHex(sourceHex);
  const h = source.hue;
  const c = source.chroma;

  // Secondary: desaturated analogous color
  const secH = h;
  const secC = Math.max(c * 0.33, 6);

  // Tertiary: hue rotated 60 degrees
  const terH = (h + 60) % 360;
  const terC = Math.max(c * 0.5, 12);

  // Error: fixed red
  const errH = 25;
  const errC = 84;

  // Neutral: nearly achromatic
  const neuC = Math.min(c * 0.08, 4);
  const neuVarC = Math.min(c * 0.16, 8);

  const light: ColorScheme = {
    primary: HctColor.from(h, c, 40).toHex(),
    onPrimary: HctColor.from(h, c, 100).toHex(),
    primaryContainer: HctColor.from(h, c, 90).toHex(),
    onPrimaryContainer: HctColor.from(h, c, 10).toHex(),
    secondary: HctColor.from(secH, secC, 40).toHex(),
    onSecondary: HctColor.from(secH, secC, 100).toHex(),
    secondaryContainer: HctColor.from(secH, secC, 90).toHex(),
    onSecondaryContainer: HctColor.from(secH, secC, 10).toHex(),
    tertiary: HctColor.from(terH, terC, 40).toHex(),
    onTertiary: HctColor.from(terH, terC, 100).toHex(),
    tertiaryContainer: HctColor.from(terH, terC, 90).toHex(),
    onTertiaryContainer: HctColor.from(terH, terC, 10).toHex(),
    error: HctColor.from(errH, errC, 40).toHex(),
    onError: HctColor.from(errH, errC, 100).toHex(),
    errorContainer: HctColor.from(errH, errC, 90).toHex(),
    onErrorContainer: HctColor.from(errH, errC, 10).toHex(),
    surface: HctColor.from(h, neuC, 98).toHex(),
    onSurface: HctColor.from(h, neuC, 10).toHex(),
    surfaceVariant: HctColor.from(h, neuVarC, 90).toHex(),
    onSurfaceVariant: HctColor.from(h, neuVarC, 30).toHex(),
    surfaceContainer: HctColor.from(h, neuC, 94).toHex(),
    surfaceContainerHigh: HctColor.from(h, neuC, 92).toHex(),
    surfaceContainerHighest: HctColor.from(h, neuC, 90).toHex(),
    outline: HctColor.from(h, neuVarC, 50).toHex(),
    outlineVariant: HctColor.from(h, neuVarC, 80).toHex(),
    shadow: "#000000",
  };

  const dark: ColorScheme = {
    primary: HctColor.from(h, c, 80).toHex(),
    onPrimary: HctColor.from(h, c, 20).toHex(),
    primaryContainer: HctColor.from(h, c, 30).toHex(),
    onPrimaryContainer: HctColor.from(h, c, 90).toHex(),
    secondary: HctColor.from(secH, secC, 80).toHex(),
    onSecondary: HctColor.from(secH, secC, 20).toHex(),
    secondaryContainer: HctColor.from(secH, secC, 30).toHex(),
    onSecondaryContainer: HctColor.from(secH, secC, 90).toHex(),
    tertiary: HctColor.from(terH, terC, 80).toHex(),
    onTertiary: HctColor.from(terH, terC, 20).toHex(),
    tertiaryContainer: HctColor.from(terH, terC, 30).toHex(),
    onTertiaryContainer: HctColor.from(terH, terC, 90).toHex(),
    error: HctColor.from(errH, errC, 80).toHex(),
    onError: HctColor.from(errH, errC, 20).toHex(),
    errorContainer: HctColor.from(errH, errC, 30).toHex(),
    onErrorContainer: HctColor.from(errH, errC, 90).toHex(),
    surface: HctColor.from(h, neuC, 6).toHex(),
    onSurface: HctColor.from(h, neuC, 90).toHex(),
    surfaceVariant: HctColor.from(h, neuVarC, 30).toHex(),
    onSurfaceVariant: HctColor.from(h, neuVarC, 80).toHex(),
    surfaceContainer: HctColor.from(h, neuC, 12).toHex(),
    surfaceContainerHigh: HctColor.from(h, neuC, 17).toHex(),
    surfaceContainerHighest: HctColor.from(h, neuC, 22).toHex(),
    outline: HctColor.from(h, neuVarC, 60).toHex(),
    outlineVariant: HctColor.from(h, neuVarC, 30).toHex(),
    shadow: "#000000",
  };

  return { light, dark };
}

/** Convert scheme to CSS variable string */
export function schemeToCss(scheme: ColorScheme, prefix = "--ii"): string {
  const entries: [string, string][] = [
    ["primary", scheme.primary],
    ["on-primary", scheme.onPrimary],
    ["primary-container", scheme.primaryContainer],
    ["on-primary-container", scheme.onPrimaryContainer],
    ["secondary", scheme.secondary],
    ["on-secondary", scheme.onSecondary],
    ["secondary-container", scheme.secondaryContainer],
    ["on-secondary-container", scheme.onSecondaryContainer],
    ["tertiary", scheme.tertiary],
    ["on-tertiary", scheme.onTertiary],
    ["tertiary-container", scheme.tertiaryContainer],
    ["on-tertiary-container", scheme.onTertiaryContainer],
    ["error", scheme.error],
    ["on-error", scheme.onError],
    ["error-container", scheme.errorContainer],
    ["on-error-container", scheme.onErrorContainer],
    ["surface", scheme.surface],
    ["on-surface", scheme.onSurface],
    ["surface-variant", scheme.surfaceVariant],
    ["on-surface-variant", scheme.onSurfaceVariant],
    ["surface-container", scheme.surfaceContainer],
    ["surface-container-high", scheme.surfaceContainerHigh],
    ["surface-container-highest", scheme.surfaceContainerHighest],
    ["outline", scheme.outline],
    ["outline-variant", scheme.outlineVariant],
    ["shadow", scheme.shadow],
  ];
  return entries.map(([k, v]) => `  ${prefix}-${k}: ${v};`).join("\n");
}

/** Generate complete light/dark CSS */
export function generateCss(sourceHex: string): string {
  const { light, dark } = generateScheme(sourceHex);
  return `:root {\n${schemeToCss(light)}\n}\n\n[data-theme="dark"] {\n${schemeToCss(dark)}\n}\n`;
}
