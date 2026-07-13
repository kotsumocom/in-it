/**
 * ThemeToggle - light/dark/system toggle
 */
import { useState, useEffect, useCallback } from "hono/jsx";
import { Icon } from "../../icons/Icon.tsx";

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
export function ThemeToggle({ defaultTheme = "system", compact = false, onChange }: ThemeToggleProps): any {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

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
        {theme === "system" && <Icon name="monitor" size={18} />}
      </button>
    );
  }

  const setAndNotify = (t: Theme) => {
    setTheme(t);
    onChange?.(t);
  };

  return (
    <div class="ii-theme-toggle-group" role="radiogroup" aria-label="Theme">
      {(["light", "dark", "system"] as Theme[]).map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={theme === t}
          class={`ii-theme-toggle-group__btn${theme === t ? " ii-theme-toggle-group__btn--active" : ""}`}
          onClick={() => setAndNotify(t)}
        >
          {t === "light" && <><Icon name="sun" size={16} /> Light</>}
          {t === "dark" && <><Icon name="moon" size={16} /> Dark</>}
          {t === "system" && <><Icon name="monitor" size={16} /> System</>}
        </button>
      ))}
    </div>
  );
}