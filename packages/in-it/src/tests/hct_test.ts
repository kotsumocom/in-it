/**
 * Tests for color/hct.ts — HctColor class and color utilities
 */
import { assertEquals, assertAlmostEquals } from "jsr:@std/assert";
import { HctColor, hexToRgb, rgbToHex } from "../color/hct.ts";

// ==================== hexToRgb / rgbToHex ====================

Deno.test("hexToRgb: parses #000000", () => {
  const [r, g, b] = hexToRgb("#000000");
  assertEquals(r, 0);
  assertEquals(g, 0);
  assertEquals(b, 0);
});

Deno.test("hexToRgb: parses #ffffff", () => {
  const [r, g, b] = hexToRgb("#ffffff");
  assertEquals(r, 255);
  assertEquals(g, 255);
  assertEquals(b, 255);
});

Deno.test("hexToRgb: parses #6750a4", () => {
  const [r, g, b] = hexToRgb("#6750a4");
  assertEquals(r, 0x67);
  assertEquals(g, 0x50);
  assertEquals(b, 0xa4);
});

Deno.test("rgbToHex: converts (0, 0, 0)", () => {
  assertEquals(rgbToHex(0, 0, 0), "#000000");
});

Deno.test("rgbToHex: converts (255, 255, 255)", () => {
  assertEquals(rgbToHex(255, 255, 255), "#ffffff");
});

Deno.test("rgbToHex: clamps out-of-range values", () => {
  assertEquals(rgbToHex(-10, 300, 128), "#00ff80");
});

// ==================== HctColor.fromHex ====================

Deno.test("HctColor.fromHex: black has tone 0", () => {
  const c = HctColor.fromHex("#000000");
  assertEquals(c.tone, 0);
});

Deno.test("HctColor.fromHex: white has tone 100", () => {
  const c = HctColor.fromHex("#ffffff");
  assertEquals(c.tone, 100);
});

Deno.test("HctColor.fromHex: pure red has hue roughly near 27", () => {
  const c = HctColor.fromHex("#ff0000");
  // Red's CAM16 hue is approximately 27 degrees
  assertEquals(c.hue > 15 && c.hue < 40, true, `Red hue was ${c.hue}`);
  assertEquals(c.chroma > 50, true, `Red chroma was ${c.chroma}`);
});

Deno.test("HctColor.fromHex: Material purple #6750a4", () => {
  const c = HctColor.fromHex("#6750a4");
  // Hue should be in purple range (roughly 260-340)
  assertEquals(c.hue > 260 && c.hue < 340, true, `Purple hue was ${c.hue}`);
  // Chroma is moderate for this color (~19)
  assertEquals(c.chroma > 10, true, `Purple chroma was ${c.chroma}`);
  // Tone should be moderate (30-50)
  assertEquals(c.tone > 25 && c.tone < 55, true, `Purple tone was ${c.tone}`);
});

// ==================== HctColor.from / toHex ====================

Deno.test("HctColor.from: achromatic (chroma=0) produces gray", () => {
  const c = HctColor.from(0, 0, 50);
  const hex = c.toHex();
  const [r, g, b] = hexToRgb(hex);
  // Should be close to gray (all channels similar)
  assertEquals(Math.abs(r - g) < 5, true, `r=${r}, g=${g}`);
  assertEquals(Math.abs(g - b) < 5, true, `g=${g}, b=${b}`);
});

Deno.test("HctColor.from: tone 0 produces black", () => {
  const c = HctColor.from(0, 50, 0);
  assertEquals(c.toHex(), "#000000");
});

Deno.test("HctColor.from: tone 100 produces white", () => {
  const c = HctColor.from(0, 50, 100);
  assertEquals(c.toHex(), "#ffffff");
});

// ==================== withTone / withChroma / withHue ====================

Deno.test("withTone: returns new HctColor with adjusted tone", () => {
  const original = HctColor.from(270, 50, 40);
  const lighter = original.withTone(80);
  assertEquals(lighter.hue, original.hue);
  assertEquals(lighter.chroma, original.chroma);
  assertEquals(lighter.tone, 80);
});

Deno.test("withChroma: returns new HctColor with adjusted chroma", () => {
  const original = HctColor.from(270, 50, 40);
  const desaturated = original.withChroma(10);
  assertEquals(desaturated.hue, original.hue);
  assertEquals(desaturated.chroma, 10);
  assertEquals(desaturated.tone, original.tone);
});

Deno.test("withHue: returns new HctColor with adjusted hue", () => {
  const original = HctColor.from(270, 50, 40);
  const shifted = original.withHue(120);
  assertEquals(shifted.hue, 120);
  assertEquals(shifted.chroma, original.chroma);
  assertEquals(shifted.tone, original.tone);
});

// ==================== Hue normalization ====================

Deno.test("HctColor.from normalizes negative hue", () => {
  const c = HctColor.from(-30, 50, 50);
  assertEquals(c.hue, 330);
});

Deno.test("HctColor.from normalizes hue > 360", () => {
  const c = HctColor.from(400, 50, 50);
  assertEquals(c.hue, 40);
});

// ==================== Clamping ====================

Deno.test("HctColor.from clamps negative chroma to 0", () => {
  const c = HctColor.from(0, -10, 50);
  assertEquals(c.chroma, 0);
});

Deno.test("HctColor.from clamps tone to 0-100", () => {
  const low = HctColor.from(0, 50, -10);
  assertEquals(low.tone, 0);
  const high = HctColor.from(0, 50, 110);
  assertEquals(high.tone, 100);
});

// ==================== toString ====================

Deno.test("toString: formats as expected", () => {
  const c = HctColor.from(270, 50, 40);
  const str = c.toString();
  assertEquals(str.startsWith("HCT(270.0, 50.0, 40.0)"), true);
  assertEquals(str.includes("#"), true);
});
