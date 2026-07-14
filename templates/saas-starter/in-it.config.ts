/**
 * in-it project configuration.
 *
 * All fields are optional — defaults are applied automatically.
 * Run `deno task gen` (or `deno task dev`) to apply changes.
 *
 * @see https://in-it.dev/docs/config
 */
import { defineConfig } from "@kotsumo/in-it/config";

export default defineConfig({
  // Site metadata (used in index.html)
  // site: {
  //   name: "My SaaS",
  //   lang: "ja",
  //   description: "次世代のSaaSプラットフォーム",
  // },

  // Theme (HCT color scheme auto-generated from primary)
  // theme: {
  //   primary: "#6750a4",
  // },

  // Icon style: "outlined" (default) or "filled"
  // icons: "outlined",

  // Auth provider (metadata only — no code generated)
  // auth: {
  //   provider: "supabase",
  // },

  // Component overrides
  // overrides: {
  //   Button: "./client/overrides/Button.tsx",
  //   AdminShell: "./client/overrides/AdminShell.tsx",
  // },
});
