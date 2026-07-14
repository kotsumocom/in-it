/**
 * Tests for color/scheme.ts — generateScheme, schemeToCss, generateCss
 */
import { assertEquals } from "jsr:@std/assert";
import { generateScheme, schemeToCss, generateCss } from "../color/scheme.ts";
import type { ColorScheme } from "../color/scheme.ts";

// ==================== generateScheme ====================

Deno.test("generateScheme: returns light and dark schemes", () => {
  const { light, dark } = generateScheme("#6750a4");
  assertEquals(typeof light, "object");
  assertEquals(typeof dark, "object");
});

Deno.test("generateScheme: all light scheme tokens are hex strings", () => {
  const { light } = generateScheme("#6750a4");
  const keys: (keyof ColorScheme)[] = [
    "primary", "onPrimary", "primaryContainer", "onPrimaryContainer",
    "secondary", "onSecondary", "secondaryContainer", "onSecondaryContainer",
    "tertiary", "onTertiary", "tertiaryContainer", "onTertiaryContainer",
    "error", "onError", "errorContainer", "onErrorContainer",
    "surface", "onSurface", "surfaceVariant", "onSurfaceVariant",
    "surfaceContainer", "surfaceContainerHigh", "surfaceContainerHighest",
    "outline", "outlineVariant", "shadow",
  ];
  for (const key of keys) {
    assertEquals(light[key].startsWith("#"), true, `light.${key} = ${light[key]}`);
    assertEquals(light[key].length, 7, `light.${key} length = ${light[key].length}`);
  }
});

Deno.test("generateScheme: all dark scheme tokens are hex strings", () => {
  const { dark } = generateScheme("#6750a4");
  const keys: (keyof ColorScheme)[] = [
    "primary", "onPrimary", "primaryContainer", "onPrimaryContainer",
    "surface", "onSurface", "outline", "shadow",
  ];
  for (const key of keys) {
    assertEquals(dark[key].startsWith("#"), true, `dark.${key} = ${dark[key]}`);
  }
});

Deno.test("generateScheme: shadow is always black", () => {
  const { light, dark } = generateScheme("#1565c0");
  assertEquals(light.shadow, "#000000");
  assertEquals(dark.shadow, "#000000");
});

Deno.test("generateScheme: light surface is lighter than dark surface", () => {
  const { light, dark } = generateScheme("#6750a4");
  // Light surface should be near white, dark surface near black
  // Simple check: light surface hex should have higher overall value
  const lightVal = parseInt(light.surface.slice(1), 16);
  const darkVal = parseInt(dark.surface.slice(1), 16);
  assertEquals(lightVal > darkVal, true, `light: ${light.surface} > dark: ${dark.surface}`);
});

Deno.test("generateScheme: different source colors produce different schemes", () => {
  const blue = generateScheme("#1565c0");
  const red = generateScheme("#c62828");
  // Primary colors should differ
  assertEquals(blue.light.primary !== red.light.primary, true);
});

// ==================== schemeToCss ====================

Deno.test("schemeToCss: generates CSS custom properties", () => {
  const { light } = generateScheme("#6750a4");
  const css = schemeToCss(light);
  assertEquals(css.includes("--ii-primary:"), true);
  assertEquals(css.includes("--ii-on-primary:"), true);
  assertEquals(css.includes("--ii-surface:"), true);
  assertEquals(css.includes("--ii-shadow:"), true);
});

Deno.test("schemeToCss: uses custom prefix", () => {
  const { light } = generateScheme("#6750a4");
  const css = schemeToCss(light, "--custom");
  assertEquals(css.includes("--custom-primary:"), true);
  assertEquals(css.includes("--ii-primary:"), false);
});

// ==================== generateCss ====================

Deno.test("generateCss: generates complete light and dark CSS", () => {
  const css = generateCss("#6750a4");
  assertEquals(css.includes(":root"), true);
  assertEquals(css.includes('[data-theme="dark"]'), true);
  assertEquals(css.includes("--ii-primary:"), true);
});
