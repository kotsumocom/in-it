/**
 * @module locale
 * Locale strings for in-it components.
 *
 * Components call `t("key")` to get the localized string.
 * The locale is set at startup via `setLocale()`.
 *
 * @example
 * ```ts
 * import { setLocale } from "@kotsumo/in-it/locale";
 * setLocale("ja");
 * ```
 */

/** Supported locales. */
export type Locale = "en" | "ja";

/** All translatable string keys. */
export interface LocaleStrings {
  // Common
  close: string;
  remove: string;
  search: string;
  // Pagination
  pagination: string;
  previousPage: string;
  nextPage: string;
  // Theme
  theme: string;
  // Breadcrumb
  breadcrumb: string;
  // AuthForm
  signIn: string;
  createAccount: string;
  loading: string;
  continueWith: string;
  or: string;
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  passwordMinPlaceholder: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  signUp: string;
  invalidEmail: string;
  passwordTooShort: string;
  nameRequired: string;
}

const en: LocaleStrings = {
  close: "Close",
  remove: "Remove",
  search: "Search...",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  theme: "Theme",
  breadcrumb: "Breadcrumb",
  signIn: "Sign In",
  createAccount: "Create Account",
  loading: "Loading...",
  continueWith: "Continue with {provider}",
  or: "or",
  name: "Name",
  namePlaceholder: "Your name",
  email: "Email",
  emailPlaceholder: "you@example.com",
  password: "Password",
  passwordPlaceholder: "Your password",
  passwordMinPlaceholder: "Min. 8 characters",
  dontHaveAccount: "Don't have an account? ",
  alreadyHaveAccount: "Already have an account? ",
  signUp: "Sign Up",
  invalidEmail: "Please enter a valid email address.",
  passwordTooShort: "Password must be at least 8 characters.",
  nameRequired: "Please enter your name.",
};

const ja: LocaleStrings = {
  close: "閉じる",
  remove: "削除",
  search: "検索...",
  pagination: "ページナビゲーション",
  previousPage: "前のページ",
  nextPage: "次のページ",
  theme: "テーマ",
  breadcrumb: "パンくずリスト",
  signIn: "ログイン",
  createAccount: "アカウント作成",
  loading: "読み込み中...",
  continueWith: "{provider}で続ける",
  or: "または",
  name: "名前",
  namePlaceholder: "お名前",
  email: "メールアドレス",
  emailPlaceholder: "you@example.com",
  password: "パスワード",
  passwordPlaceholder: "パスワード",
  passwordMinPlaceholder: "8文字以上",
  dontHaveAccount: "アカウントをお持ちでない方 ",
  alreadyHaveAccount: "アカウントをお持ちの方 ",
  signUp: "新規登録",
  invalidEmail: "有効なメールアドレスを入力してください。",
  passwordTooShort: "パスワードは8文字以上必要です。",
  nameRequired: "名前を入力してください。",
};

/** All locales. */
export const locales: Record<Locale, LocaleStrings> = { en, ja };

/** Current active locale. */
let currentLocale: Locale = "en";

/** Set the active locale. */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

/** Get the current locale. */
export function getLocale(): Locale {
  return currentLocale;
}

/** Get a translated string by key. */
export function t(key: keyof LocaleStrings): string {
  return locales[currentLocale][key];
}
