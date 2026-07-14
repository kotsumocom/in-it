/**
 * Tests for config.ts — setConfig / getConfig / defineConfig
 */
import { assertEquals, assertNotEquals } from "jsr:@std/assert";
import { setConfig, getConfig, defineConfig, defaults } from "../config.ts";
import type { InItConfig } from "../config.ts";

Deno.test("getConfig returns defaults initially", () => {
  // Reset to defaults
  setConfig({});
  const config = getConfig();
  assertEquals(config.site?.name, defaults.site.name);
  assertEquals(config.site?.lang, defaults.site.lang);
  assertEquals(config.theme?.primary, defaults.theme.primary);
  assertEquals(config.theme?.defaultMode, defaults.theme.defaultMode);
  assertEquals(config.icons, defaults.icons);
  assertEquals(config.locale, defaults.locale);
});

Deno.test("setConfig merges site config with defaults", () => {
  setConfig({ site: { name: "Test App" } });
  const config = getConfig();
  assertEquals(config.site?.name, "Test App");
  // lang should still be default
  assertEquals(config.site?.lang, "ja");
});

Deno.test("setConfig merges theme config with defaults", () => {
  setConfig({ theme: { primary: "#ff0000" } });
  const config = getConfig();
  assertEquals(config.theme?.primary, "#ff0000");
  // defaultMode should still be default
  assertEquals(config.theme?.defaultMode, "system");
});

Deno.test("setConfig preserves icons setting", () => {
  setConfig({ icons: "filled" });
  const config = getConfig();
  assertEquals(config.icons, "filled");
});

Deno.test("setConfig preserves locale setting", () => {
  setConfig({ locale: "ja" });
  const config = getConfig();
  assertEquals(config.locale, "ja");
});

Deno.test("setConfig supports component overrides", () => {
  setConfig({
    overrides: {
      Button: "./overrides/Button.tsx",
    },
  });
  const config = getConfig();
  assertEquals(config.overrides?.Button, "./overrides/Button.tsx");
});

Deno.test("defineConfig returns the same config object", () => {
  const input: InItConfig = {
    site: { name: "MyApp" },
    theme: { primary: "#123456" },
  };
  const result = defineConfig(input);
  assertEquals(result, input);
});

Deno.test("defaults have expected values", () => {
  assertEquals(defaults.site.name, "My SaaS");
  assertEquals(defaults.site.lang, "ja");
  assertEquals(defaults.site.description, "");
  assertEquals(defaults.theme.primary, "#6750a4");
  assertEquals(defaults.theme.defaultMode, "system");
  assertEquals(defaults.icons, "outlined");
  assertEquals(defaults.locale, "en");
});
