/**
 * AuthForm — Login / Signup form component.
 *
 * Usage:
 *   <AuthForm
 *     mode="login"
 *     onSubmit={(data) => console.log(data)}
 *     providers={["google", "github"]}
 *   />
 *
 * Security:
 * - All inputs are sanitized (HTML entities escaped)
 * - Email validation via pattern
 * - Password minimum length enforced
 * - Form uses noValidate + custom validation to prevent XSS in error messages
 */
import { useState, useCallback } from "hono/jsx";
import { useLabels } from "../../locale.ts";
import type { LocaleStrings } from "../../locale.ts";
import { Button, Input } from "../ui/mod.tsx";
import { injectCSS } from "../../inject.ts";
import { escapeHtml } from "../../security/sanitize.ts";

/** @internal CSS for AuthForm — co-located for self-containment. */
export const AUTH_FORM_CSS = `/* --- AuthForm --- */
.ii-auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--ii-spacing-6);
}
.ii-auth-form__title {
  font-size: var(--ii-font-xl);
  font-weight: 700;
  color: var(--ii-on-surface);
  margin: 0 0 var(--ii-spacing-6);
  text-align: center;
}
.ii-auth-form__providers {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-2);
  margin-bottom: var(--ii-spacing-4);
}
.ii-auth-form__provider-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ii-spacing-2);
  padding: 10px 16px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  cursor: pointer;
  transition: background var(--ii-transition), border-color var(--ii-transition);
}
.ii-auth-form__provider-btn:hover {
  background: var(--ii-surface-container);
  border-color: var(--ii-outline);
}
.ii-auth-form__provider-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ii-auth-form__divider {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  margin: var(--ii-spacing-3) 0;
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-sm);
}
.ii-auth-form__divider::before,
.ii-auth-form__divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--ii-outline-variant);
}
.ii-auth-form form {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-4);
}
.ii-auth-form__error {
  padding: var(--ii-spacing-3);
  background: color-mix(in srgb, var(--ii-error) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--ii-error) 30%, transparent);
  border-radius: var(--ii-shape-sm);
  color: var(--ii-error);
  font-size: var(--ii-font-sm);
}
.ii-auth-form__submit {
  width: 100%;
  margin-top: var(--ii-spacing-2);
}
.ii-auth-form__switch {
  text-align: center;
  margin-top: var(--ii-spacing-4);
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-auth-form__switch-btn {
  background: none;
  border: none;
  color: var(--ii-primary);
  font-weight: 600;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  padding: 0;
}
.ii-auth-form__switch-btn:hover {
  text-decoration: underline;
}
`;

/** Auth form mode. */
export type AuthMode = "login" | "signup";

/** Data emitted on form submission. */
export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}

/** OAuth provider configuration. */
export interface AuthProvider {
  id: string;
  label: string;
  icon?: any;
}

/** Locale keys used by AuthForm. */
type AuthFormLabelKeys =
  | "signIn" | "createAccount" | "loading" | "continueWith" | "or"
  | "name" | "namePlaceholder" | "email" | "emailPlaceholder" | "password"
  | "passwordPlaceholder" | "passwordMinPlaceholder"
  | "dontHaveAccount" | "alreadyHaveAccount" | "signUp"
  | "invalidEmail" | "passwordTooShort" | "nameRequired";

/** @internal Keys array for useLabels. */
const AUTH_FORM_KEYS: readonly AuthFormLabelKeys[] = [
  "signIn", "createAccount", "loading", "continueWith", "or",
  "name", "namePlaceholder", "email", "emailPlaceholder", "password",
  "passwordPlaceholder", "passwordMinPlaceholder",
  "dontHaveAccount", "alreadyHaveAccount", "signUp",
  "invalidEmail", "passwordTooShort", "nameRequired",
] as const;

/** Props for AuthForm. */
export interface AuthFormProps {
  /** Login or signup mode. */
  mode?: AuthMode;
  /** Called with sanitized form data on submit. */
  onSubmit?: (data: AuthFormData) => void;
  /** Called when OAuth provider button is clicked. */
  onProviderClick?: (providerId: string) => void;
  /** OAuth provider buttons to show. Pass string IDs or full config objects. */
  providers?: (string | AuthProvider)[];
  /** Link to toggle between login/signup. */
  onModeSwitch?: () => void;
  /** Disable the form (e.g. during loading). */
  loading?: boolean;
  /** Error message to display. */
  error?: string;
  /** Override built-in locale strings. */
  labels?: Partial<Pick<LocaleStrings, AuthFormLabelKeys>>;
  /** Additional CSS class. */
  class?: string;
}

/** Sanitize user input to prevent XSS (delegates to shared escapeHtml). */
function sanitize(str: string): string {
  return escapeHtml(str);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_PROVIDERS: Record<string, AuthProvider> = {
  google: { id: "google", label: "Google" },
  github: { id: "github", label: "GitHub" },
  apple: { id: "apple", label: "Apple" },
  microsoft: { id: "microsoft", label: "Microsoft" },
};

/** Login / Signup form with OAuth provider buttons and input validation. */
export function AuthForm({
  mode = "login",
  onSubmit,
  onProviderClick,
  providers = [],
  onModeSwitch,
  loading,
  error,
  labels: labelOverrides,
  class: cls,
}: AuthFormProps): any {
  injectCSS("ii-auth-form", AUTH_FORM_CSS);
  const l = useLabels(AUTH_FORM_KEYS, labelOverrides);
  const [formError, setFormError] = useState("");

  const handleSubmit = useCallback(
    (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const data = new FormData(form);
      const email = sanitize((data.get("email") as string) ?? "").trim();
      const password = (data.get("password") as string) ?? "";
      const name = mode === "signup" ? sanitize((data.get("name") as string) ?? "").trim() : undefined;

      if (!EMAIL_RE.test(email)) {
        setFormError(l.invalidEmail);
        return;
      }
      if (password.length < 8) {
        setFormError(l.passwordTooShort);
        return;
      }
      if (mode === "signup" && (!name || name.length < 1)) {
        setFormError(l.nameRequired);
        return;
      }

      setFormError("");
      onSubmit?.({ email, password, name });
    },
    [mode, onSubmit],
  );

  const resolvedProviders = providers.map((p) =>
    typeof p === "string" ? DEFAULT_PROVIDERS[p] ?? { id: p, label: p } : p,
  );

  const displayError = error ?? formError;
  const isLogin = mode === "login";

  return (
    <div class={`ii-auth-form${cls ? ` ${cls}` : ""}`}>
      <h2 class="ii-auth-form__title">{isLogin ? l.signIn : l.createAccount}</h2>

      {resolvedProviders.length > 0 && (
        <div class="ii-auth-form__providers">
          {resolvedProviders.map((p) => (
            <button
              key={p.id}
              type="button"
              class="ii-auth-form__provider-btn"
              onClick={() => onProviderClick?.(p.id)}
              disabled={loading}
            >
              {p.icon ?? null}
              <span>{l.continueWith.replace("{provider}", p.label)}</span>
            </button>
          ))}
          <div class="ii-auth-form__divider">
            <span>{l.or}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <Input
            id="auth-name"
            name="name"
            type="text"
            label={l.name}
            placeholder={l.namePlaceholder}
            required
            autocomplete="name"
            disabled={loading}
          />
        )}

        <Input
          id="auth-email"
          name="email"
          type="email"
          label={l.email}
          placeholder={l.emailPlaceholder}
          required
          autocomplete="email"
          disabled={loading}
        />

        <Input
          id="auth-password"
          name="password"
          type="password"
          label={l.password}
          placeholder={isLogin ? l.passwordPlaceholder : l.passwordMinPlaceholder}
          required
          minLength={8}
          autocomplete={isLogin ? "current-password" : "new-password"}
          disabled={loading}
        />

        {displayError && (
          <div class="ii-auth-form__error" role="alert">{displayError}</div>
        )}

        <Button type="submit" variant="filled" class="ii-auth-form__submit" disabled={loading}>
          {loading ? l.loading : isLogin ? l.signIn : l.createAccount}
        </Button>
      </form>

      {onModeSwitch && (
        <p class="ii-auth-form__switch">
          {isLogin ? l.dontHaveAccount : l.alreadyHaveAccount}
          <button type="button" class="ii-auth-form__switch-btn" onClick={onModeSwitch}>
            {isLogin ? l.signUp : l.signIn}
          </button>
        </p>
      )}
    </div>
  );
}
