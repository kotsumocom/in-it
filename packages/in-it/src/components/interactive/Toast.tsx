/**
 * Toast component (hono/jsx/dom)
 * WAI-ARIA Alert + Live Region
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";

/** ToastItem interface */
export interface ToastItem {
  id: number;
  message: string;
  variant?: "info" | "success" | "warning" | "error";
  duration?: number;
}

let toastIdCounter = 0;
let globalAddToast: ((t: ToastItem) => void) | null = null;

/** toast */
export function toast(message: string, variant: ToastItem["variant"] = "info", duration = 4000): any {
  if (globalAddToast) {
    globalAddToast({ id: ++toastIdCounter, message, variant, duration });
  }
}

/** ToastContainerProps interface */
export interface ToastContainerProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

/** ToastContainer */
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
            {t.variant === "success" && "ok"}
            {t.variant === "error" && "x"}
            {t.variant === "warning" && "!"}
            {(!t.variant || t.variant === "info") && "i"}
          </span>
          <span class="ii-toast__msg">{t.message}</span>
          <button class="ii-toast__close" onClick={() => remove(t.id)} aria-label="Close">x</button>
        </div>
      ))}
    </div>
  );
}