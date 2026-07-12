/**
 * ThemeToggle - light/dark/system toggle
 */
import { useState, useEffect, useCallback } from "hono/jsx";

export type Theme = "light" | "dark" | "system";

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

export function ThemeToggle({ defaultTheme = "system", compact = false, onChange }: ThemeToggleProps) {
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
        {theme === "light" && "L"}
        {theme === "dark" && "D"}
        {theme === "system" && "S"}
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
          {t === "light" && "Light"}
          {t === "dark" && "Dark"}
          {t === "system" && "System"}
        </button>
      ))}
    </div>
  );
}
