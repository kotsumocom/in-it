/**
 * ThemeToggle - light/dark/system toggle
 */
import { useState, useEffect, useCallback } from "hono/jsx";
import { Icon } from "../../icons/Icon.tsx";
import { t } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

import { getConfig } from "../../config.ts";

/** @internal CSS for ThemeToggle — co-located for self-containment. */
export const THEME_TOGGLE_CSS = `/* --- Theme Toggle --- */
.ii-theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: var(--ii-spacing-2);
  border-radius: var(--ii-shape-sm);
  transition: background var(--ii-transition);
}
.ii-theme-toggle:hover { background: var(--ii-surface-container-high); }
.ii-theme-toggle-group {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  background: var(--ii-surface-container);
  border-radius: var(--ii-shape-md);
}
.ii-theme-toggle-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 6px 10px;
  border-radius: var(--ii-shape-sm);
  transition: background var(--ii-transition);
}
.ii-theme-toggle-btn:hover { background: var(--ii-surface-container-high); }
.ii-theme-toggle-btn--active {
  background: var(--ii-surface);
  box-shadow: var(--ii-shadow-sm);
}
`;

/** Available theme modes: light, dark, or system preference. */
export type Theme = "light" | "dark" | "system";

/** Props for the ThemeToggle component. */
export interface ThemeToggleProps {
  defaultTheme?: Theme;
  compact?: boolean;
  onChange?: (theme: Theme) => void;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.setAttribute("data-theme", resolved);
}

/** Light/dark/system theme toggle with persistence via data-theme attribute. */
export function ThemeToggle({ defaultTheme, compact = false, onChange }: ThemeToggleProps): any {
  injectCSS("ii-theme-toggle", THEME_TOGGLE_CSS);
  const initialTheme = defaultTheme ?? getConfig().theme?.defaultMode ?? "system";
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const cycle = useCallback(() => {
    const order: Theme[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    onChange?.(next);
  }, [theme, onChange]);

  if (compact) {
    return (
      <button type="button" class="ii-theme-toggle" onClick={cycle} aria-label={`Theme: ${theme}`}>
        {theme === "light" && <Icon name="sun" size={18} />}
        {theme === "dark" && <Icon name="moon" size={18} />}
        {theme === "system" && <Icon name="device-desktop" size={18} />}
      </button>
    );
  }

  const setAndNotify = (mode: Theme) => {
    setTheme(mode);
    onChange?.(mode);
  };

  return (
    <div class="ii-theme-toggle-group" role="radiogroup" aria-label={t("theme")}>
      {(["light", "dark", "system"] as Theme[]).map((mode) => (
        <button
          key={mode}
          type="button"
          role="radio"
          aria-checked={theme === mode}
          class={`ii-theme-toggle-btn${theme === mode ? " ii-theme-toggle-btn--active" : ""}`}
          onClick={() => setAndNotify(mode)}
        >
          {mode === "light" && <><Icon name="sun" size={16} /> {t("light")}</>}
          {mode === "dark" && <><Icon name="moon" size={16} /> {t("dark")}</>}
          {mode === "system" && <><Icon name="device-desktop" size={16} /> {t("system")}</>}
        </button>
      ))}
    </div>
  );
}