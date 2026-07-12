/**
 * Toast 繧ｳ繝ｳ繝昴・繝阪Φ繝茨ｼ・ono/jsx/dom・・ * WAI-ARIA Alert + Live Region 貅匁侠
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

// 繧ｰ繝ｭ繝ｼ繝舌Ν縺ｪ繝医・繧ｹ繝育ｮ｡逅・let toastIdCounter = 0;
let globalSetToasts: ((fn: (prev: ToastItem[]) => ToastItem[]) => void) | null = null;

/** 繝医・繧ｹ繝医ｒ陦ｨ遉ｺ縺吶ｋ・医げ繝ｭ繝ｼ繝舌Ν髢｢謨ｰ・・*/
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
    <div class={`ii-toast-container ii-toast-container--${position}`} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} class={`ii-toast ii-toast--${t.variant}`} role="alert" aria-atomic={true}>
          <span class="ii-toast__icon">
            {t.variant === "success" && "笨・}
            {t.variant === "error" && "笨・}
            {t.variant === "warning" && "笞"}
            {t.variant === "info" && "邃ｹ"}
          </span>
          <span class="ii-toast__message">{t.message}</span>
          <button
            type="button"
            class="ii-toast__close"
            aria-label="髢峨§繧・
            onClick={() => dismiss(t.id)}
          >
            笨・          </button>
        </div>
      ))}
    </div>
  );
}

