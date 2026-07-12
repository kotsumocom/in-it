/**
 * プリセットカラー — 事前計算済みテーマ
 */
import { generateScheme, generateCss, type ColorScheme } from "./scheme.ts";

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

/** 全プリセットを事前計算 */
function buildPresets(): PresetColor[] {
  return PRESET_SOURCES.map(({ name, label, hex }) => {
    const { light, dark } = generateScheme(hex);
    return { name, label, hex, light, dark };
  });
}

// 事前計算済みプリセット（モジュール読み込み時に1回だけ計算）
export const PRESETS: PresetColor[] = buildPresets();

/** プリセット名から検索 */
export function getPreset(name: string): PresetColor | undefined {
  return PRESETS.find(p => p.name === name);
}

/** プリセット名から CSS 文字列を生成 */
export function getPresetCss(name: string): string {
  const preset = getPreset(name);
  if (!preset) throw new Error(`Unknown preset: ${name}. Available: ${PRESETS.map(p => p.name).join(", ")}`);
  return generateCss(preset.hex);
}

/** 全プリセット名を取得 */
export function getPresetNames(): string[] {
  return PRESETS.map(p => p.name);
}
