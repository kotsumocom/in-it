/**
 * Toast component (hono/jsx/dom)
 * WAI-ARIA Alert + Live Region
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { Icon } from "../../icons/Icon.tsx";
import { TOAST_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
import { t as tr } from "../../locale.ts";

/** A single toast notification with message, variant, and auto-dismiss duration. */
export interface ToastItem {
  id: number;
  message: string;
  variant?: "info" | "success" | "warning" | "error";
  duration?: number;
}

let toastIdCounter = 0;
let globalAddToast: ((t: ToastItem) => void) | null = null;

/** Global toast function to show notifications from anywhere. */
export function toast(message: string, variant: ToastItem["variant"] = "info", duration = 4000): any {
  injectCSS("ii-toast", TOAST_CSS);
  if (globalAddToast) {
    globalAddToast({ id: ++toastIdCounter, message, variant, duration });
  }
}

/** Props for the ToastContainer component. */
export interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

/** Container that renders active toast notifications with ARIA live region. */
export function ToastContainer({ position = "top-right" }: ToastContainerProps): any {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    globalAddToast = (t) => setToasts((prev) => [...prev, t]);
    return () => { globalAddToast = null; };
  }, []);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => remove(t.id), t.duration ?? 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  return (
    <div class={`ii-toast-container ii-toast-container--${position}`} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} class={`ii-toast ii-toast--${t.variant ?? "info"}`} role="alert">
          <span class="ii-toast__icon">
            {t.variant === "success" && <Icon name="circle-check" size={18} />}
            {t.variant === "error" && <Icon name="circle-x" size={18} />}
            {t.variant === "warning" && <Icon name="alert-triangle" size={18} />}
            {(!t.variant || t.variant === "info") && <Icon name="info-circle" size={18} />}
          </span>
          <span class="ii-toast__msg">{t.message}</span>
          <button class="ii-toast__close" onClick={() => remove(t.id)} aria-label={tr("close")}><Icon name="x" size={16} /></button>
        </div>
      ))}
    </div>
  );
}