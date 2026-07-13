/**
 * @module color/presets
 * Preset colors with pre-computed MD3 themes.
 *
 * @example
 * ```ts
 * import { getPreset, getPresetCss, PRESETS } from "@kotsumo/in-it/color/presets";
 *
 * // List all preset names
 * console.log(PRESETS.map(p => p.name));
 *
 * // Get CSS for a preset
 * const css = getPresetCss("purple");
 * ```
 */
import { generateScheme, generateCss, type ColorScheme } from "./scheme.ts";

/** PresetColor interface */
export interface PresetColor {
  name: string;
  label: string;
  hex: string;
  light: ColorScheme;
  dark: ColorScheme;
}

const PRESET_SOURCES: { name: string; label: string; hex: string }[] = [
  { name: "purple", label: "Purple", hex: "#6750a4" },
  { name: "blue", label: "Blue", hex: "#1565c0" },
  { name: "teal", label: "Teal", hex: "#00695c" },
  { name: "green", label: "Green", hex: "#2e7d32" },
  { name: "orange", label: "Orange", hex: "#e65100" },
  { name: "pink", label: "Pink", hex: "#c2185b" },
  { name: "red", label: "Red", hex: "#c62828" },
  { name: "indigo", label: "Indigo", hex: "#283593" },
];

/** Pre-compute all presets */
function buildPresets(): PresetColor[] {
  return PRESET_SOURCES.map(({ name, label, hex }) => {
    const { light, dark } = generateScheme(hex);
    return { name, label, hex, light, dark };
  });
}

// Pre-computed presets (calculated once on module load)
/** PRESETS */
export const PRESETS: PresetColor[] = buildPresets();

/** Lookup by preset name */
export function getPreset(name: string): PresetColor | undefined {
  return PRESETS.find(p => p.name === name);
}

/** Generate CSS string from preset name */
export function getPresetCss(name: string): string {
  const preset = getPreset(name);
  if (!preset) throw new Error(`Unknown preset: ${name}. Available: ${PRESETS.map(p => p.name).join(", ")}`);
  return generateCss(preset.hex);
}

/** Get all preset names */
export function getPresetNames(): string[] {
  return PRESETS.map(p => p.name);
}