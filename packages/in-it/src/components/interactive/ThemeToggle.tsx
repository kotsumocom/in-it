/**
 * テーマ切替コンポーネント
 * ライト/ダーク/システムの 3 モード対応
 */
import { useState, useEffect } from "hono/jsx";

export type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme {
  try {
    return (localStorage.getItem("sc-theme") as Theme) ?? "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  try {
    localStorage.setItem("sc-theme", theme);
  } catch {}
}

function getEffectiveTheme(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export interface ThemeToggleProps {
  /** ボタンのみ（ドロップダウンなし） */
  simple?: boolean;
}

export function ThemeToggle({ simple = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme());
  const [effective, setEffective] = useState<"light" | "dark">(getEffectiveTheme(getStoredTheme()));

  useEffect(() => {
    applyTheme(theme);
    setEffective(getEffectiveTheme(theme));

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => setEffective(mq.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [theme]);

  if (simple) {
    const toggle = () => {
      setTheme((t) => {
        const next = effective === "dark" ? "light" : "dark";
        return next;
      });
    };
    return (
      <button
        type="button"
        class="sc-theme-toggle"
        aria-label={`テーマ切替（現在: ${effective === "dark" ? "ダーク" : "ライト"}）`}
        onClick={toggle}
      >
        {effective === "dark" ? "☀️" : "🌙"}
      </button>
    );
  }

  return (
    <div class="sc-theme-toggle-group">
      <button
        type="button"
        class={`sc-theme-toggle-btn${theme === "light" ? " sc-theme-toggle-btn--active" : ""}`}
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
        title="ライトモード"
      >
        ☀️
      </button>
      <button
        type="button"
        class={`sc-theme-toggle-btn${theme === "dark" ? " sc-theme-toggle-btn--active" : ""}`}
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
        title="ダークモード"
      >
        🌙
      </button>
      <button
        type="button"
        class={`sc-theme-toggle-btn${theme === "system" ? " sc-theme-toggle-btn--active" : ""}`}
        aria-pressed={theme === "system"}
        onClick={() => setTheme("system")}
        title="システム設定に従う"
      >
        💻
      </button>
    </div>
  );
}
