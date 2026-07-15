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
  light: string;
  dark: string;
  system: string;
  // Breadcrumb
  breadcrumb: string;
  // UI defaults
  goHome: string;
  getStarted: string;
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
  // FileUpload
  dropFiles: string;
  browseFiles: string;
  fileTooLarge: string;
  invalidFileType: string;
  tooManyFiles: string;
  // Auth
  signOut: string;
  sessionExpired: string;
  unauthorized: string;
}

const en: LocaleStrings = {
  close: "Close",
  remove: "Remove",
  search: "Search...",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  theme: "Theme",
  light: "Light",
  dark: "Dark",
  system: "System",
  breadcrumb: "Breadcrumb",
  goHome: "Go Home",
  getStarted: "Get Started",
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
  // FileUpload
  dropFiles: "Drop files here or",
  browseFiles: "browse",
  fileTooLarge: "File is too large",
  invalidFileType: "File type not accepted",
  tooManyFiles: "Too many files",
  // Auth
  signOut: "Sign Out",
  sessionExpired: "Your session has expired. Please sign in again.",
  unauthorized: "You must be signed in to access this page.",
};

const ja: LocaleStrings = {
  close: "閉じる",
  remove: "削除",
  search: "検索...",
  pagination: "ページナビゲーション",
  previousPage: "前のページ",
  nextPage: "次のページ",
  theme: "テーマ",
  light: "ライト",
  dark: "ダーク",
  system: "システム",
  breadcrumb: "パンくずリスト",
  goHome: "ホームへ",
  getStarted: "はじめる",
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
  // FileUpload
  dropFiles: "ここにファイルをドロップ、または",
  browseFiles: "ファイルを選択",
  fileTooLarge: "ファイルサイズが大きすぎます",
  invalidFileType: "対応していないファイル形式です",
  tooManyFiles: "ファイル数が上限を超えています",
  // Auth
  signOut: "ログアウト",
  sessionExpired: "セッションが期限切れです。再度ログインしてください。",
  unauthorized: "このページにアクセスするにはログインが必要です。",
};

/** All locales. */
export const locales: Record<Locale, LocaleStrings> = { en, ja };

/** Current active locale. */
let currentLocale: Locale = "en";

/** Set the active locale. */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
  // Sync HTML lang attribute for CSS :lang() selectors and browser i18n
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", locale);
  }
}

/** Get the current locale. */
export function getLocale(): Locale {
  return currentLocale;
}

/** Get a translated string by key (internal — use `useLabels` in components). */
function t(key: keyof LocaleStrings): string {
  return locales[currentLocale][key];
}

/**
 * Resolve locale labels with optional per-component overrides.
 *
 * Components use this to allow callers to customize built-in strings
 * via a `labels` prop while falling back to the global `t()` defaults.
 *
 * @example
 * ```ts
 * // Inside a component:
 * const l = useLabels(["close", "remove"] as const, props.labels);
 * // l.close → props.labels?.close ?? t("close")
 * ```
 */
export function useLabels<K extends keyof LocaleStrings>(
  keys: readonly K[],
  overrides?: Partial<Pick<LocaleStrings, K>>,
): Pick<LocaleStrings, K> {
  const result = {} as Pick<LocaleStrings, K>;
  for (const key of keys) {
    result[key] = overrides?.[key] ?? t(key);
  }
  return result;
}
