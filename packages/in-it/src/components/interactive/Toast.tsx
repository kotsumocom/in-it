/**
 * Toast component (hono/jsx/dom)
 * WAI-ARIA Alert + Live Region
 */
import { useState, useEffect, useCallback } from "hono/jsx";
import { Icon } from "../../icons/Icon.tsx";
import { injectCSS } from "../../inject.ts";
import { t as tr } from "../../locale.ts";

/** @internal CSS for Toast — co-located for self-containment. */
export const TOAST_CSS = `/* --- Toast --- */
.ii-toast-container {
  position: fixed;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-2);
  max-width: 400px;
  pointer-events: none;
}
.ii-toast-container--top-right { top: var(--ii-spacing-6); right: var(--ii-spacing-6); }
.ii-toast-container--top-left { top: var(--ii-spacing-6); left: var(--ii-spacing-6); }
.ii-toast-container--bottom-right { bottom: var(--ii-spacing-6); right: var(--ii-spacing-6); }
.ii-toast-container--bottom-left { bottom: var(--ii-spacing-6); left: var(--ii-spacing-6); }
.ii-toast {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md);
  pointer-events: auto;
  animation: ii-slide-up 200ms ease;
  font-size: var(--ii-font-base);
}
.ii-toast--success { background: color-mix(in srgb, var(--ii-success) 12%, var(--ii-surface)); border-left: 3px solid var(--ii-success); }
.ii-toast--error { background: color-mix(in srgb, var(--ii-error) 12%, var(--ii-surface)); border-left: 3px solid var(--ii-error); }
.ii-toast--warning { background: color-mix(in srgb, var(--ii-warning) 12%, var(--ii-surface)); border-left: 3px solid var(--ii-warning); }
.ii-toast--info { background: color-mix(in srgb, var(--ii-info) 12%, var(--ii-surface)); border-left: 3px solid var(--ii-info); }
.ii-toast__icon { font-size: 1.1rem; flex-shrink: 0; }
.ii-toast__message { flex: 1; }
.ii-toast__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ii-on-surface-variant);
  padding: 2px;
  font-size: 0.85rem;
}
`;

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
          <span class="ii-toast__message">{t.message}</span>
          <button class="ii-toast__close" onClick={() => remove(t.id)} aria-label={tr("close")}><Icon name="x" size={16} /></button>
        </div>
      ))}
    </div>
  );
}