/**
 * Tests for locale.ts — setLocale / getLocale / t
 */
import { assertEquals } from "jsr:@std/assert";
import { setLocale, getLocale, t, locales } from "../locale.ts";
import type { Locale, LocaleStrings } from "../locale.ts";

Deno.test("getLocale returns 'en' by default", () => {
  setLocale("en"); // reset
  assertEquals(getLocale(), "en");
});

Deno.test("setLocale changes locale to 'ja'", () => {
  setLocale("ja");
  assertEquals(getLocale(), "ja");
  // Reset
  setLocale("en");
});

Deno.test("t returns English strings when locale is 'en'", () => {
  setLocale("en");
  assertEquals(t("close"), "Close");
  assertEquals(t("search"), "Search...");
  assertEquals(t("signIn"), "Sign In");
  assertEquals(t("goHome"), "Go Home");
});

Deno.test("t returns Japanese strings when locale is 'ja'", () => {
  setLocale("ja");
  assertEquals(t("close"), "閉じる");
  assertEquals(t("search"), "検索...");
  assertEquals(t("signIn"), "ログイン");
  assertEquals(t("goHome"), "ホームへ");
  // Reset
  setLocale("en");
});

Deno.test("locales object contains both en and ja", () => {
  assertEquals(typeof locales.en, "object");
  assertEquals(typeof locales.ja, "object");
});

Deno.test("all locale keys are present in both en and ja", () => {
  const enKeys = Object.keys(locales.en) as (keyof LocaleStrings)[];
  const jaKeys = Object.keys(locales.ja) as (keyof LocaleStrings)[];
  assertEquals(enKeys.length, jaKeys.length);
  for (const key of enKeys) {
    assertEquals(typeof locales.ja[key], "string", `Missing ja key: ${key}`);
  }
  for (const key of jaKeys) {
    assertEquals(typeof locales.en[key], "string", `Missing en key: ${key}`);
  }
});

Deno.test("all locale strings are non-empty", () => {
  for (const locale of ["en", "ja"] as Locale[]) {
    const strings = locales[locale];
    for (const [key, value] of Object.entries(strings)) {
      assertEquals(value.length > 0, true, `${locale}.${key} is empty`);
    }
  }
});

Deno.test("continueWith contains {provider} placeholder", () => {
  assertEquals(locales.en.continueWith.includes("{provider}"), true);
  assertEquals(locales.ja.continueWith.includes("{provider}"), true);
});
