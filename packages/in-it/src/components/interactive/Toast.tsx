/**
 * Toast コンポーネント（hono/jsx/dom）
 * WAI-ARIA Alert + Live Region 準拠
 */
import { useState, useCallback } from "hono/jsx";
import type { ToastVariant } from "../../aria/toast.ts";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

export interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

// グローバルなトースト管理
let toastIdCounter = 0;
let globalSetToasts: ((fn: (prev: ToastItem[]) => ToastItem[]) => void) | null = null;

/** トーストを表示する（グローバル関数） */
export function toast(message: string, variant: ToastVariant = "info", duration = 5000) {
  const id = `toast-${++toastIdCounter}`;
  const item: ToastItem = { id, message, variant };

  globalSetToasts?.((prev) => [...prev, item].slice(-5));

  if (duration > 0) {
    setTimeout(() => {
      globalSetToasts?.((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }

  return id;
}

export function ToastContainer({ position = "top-right" }: ToastContainerProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  globalSetToasts = setToasts;

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div class={`sc-toast-container sc-toast-container--${position}`} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} class={`sc-toast sc-toast--${t.variant}`} role="alert" aria-atomic={true}>
          <span class="sc-toast__icon">
            {t.variant === "success" && "✓"}
            {t.variant === "error" && "✕"}
            {t.variant === "warning" && "⚠"}
            {t.variant === "info" && "ℹ"}
          </span>
          <span class="sc-toast__message">{t.message}</span>
          <button
            type="button"
            class="sc-toast__close"
            aria-label="閉じる"
            onClick={() => dismiss(t.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
