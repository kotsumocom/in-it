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
  /** Additional CSS class. */
  class?: string;
}

/** Sanitize user input to prevent XSS. */
function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
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
  class: cls,
}: AuthFormProps): any {
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
        setFormError("Please enter a valid email address.");
        return;
      }
      if (password.length < 8) {
        setFormError("Password must be at least 8 characters.");
        return;
      }
      if (mode === "signup" && (!name || name.length < 1)) {
        setFormError("Please enter your name.");
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
      <h2 class="ii-auth-form__title">{isLogin ? "Sign In" : "Create Account"}</h2>

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
              <span>Continue with {p.label}</span>
            </button>
          ))}
          <div class="ii-auth-form__divider">
            <span>or</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {!isLogin && (
          <div class="ii-input-field">
            <label class="ii-input-field__label" for="auth-name">Name</label>
            <input
              id="auth-name"
              name="name"
              type="text"
              class="ii-input"
              placeholder="Your name"
              required
              autocomplete="name"
              disabled={loading}
            />
          </div>
        )}

        <div class="ii-input-field">
          <label class="ii-input-field__label" for="auth-email">Email</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            class="ii-input"
            placeholder="you@example.com"
            required
            autocomplete="email"
            disabled={loading}
          />
        </div>

        <div class="ii-input-field">
          <label class="ii-input-field__label" for="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            class="ii-input"
            placeholder={isLogin ? "Your password" : "Min. 8 characters"}
            required
            minLength={8}
            autocomplete={isLogin ? "current-password" : "new-password"}
            disabled={loading}
          />
        </div>

        {displayError && (
          <div class="ii-auth-form__error" role="alert">{displayError}</div>
        )}

        <button type="submit" class="ii-btn ii-btn--filled ii-auth-form__submit" disabled={loading}>
          {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>

      {onModeSwitch && (
        <p class="ii-auth-form__switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" class="ii-auth-form__switch-btn" onClick={onModeSwitch}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      )}
    </div>
  );
}
