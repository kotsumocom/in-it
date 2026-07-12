/**
 * WAI-ARIA Alert + Live Region pattern (Toast)
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 *
 * Manages aria-live for screen reader notifications.
 */

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  createdAt: number;
}

export interface ToastApi {
  /** Props to apply to the toast container */
  regionProps: {
    role: "status";
    "aria-live": "polite";
    "aria-label": string;
  };
  /** Get props for each toast */
  getToastProps: (id: string) => {
    role: "alert";
    "aria-atomic": true;
  };
  /** Add a toast */
  add: (message: string, variant?: ToastVariant, duration?: number) => string;
  /** Remove a toast */
  dismiss: (id: string) => void;
  /** Remove all */
  dismissAll: () => void;
  /** Current toast list */
  toasts: Toast[];
}

export interface CreateToastOptions {
  /** Default display duration (ms) */
  defaultDuration?: number;
  /** Maximum number of toasts */
  maxCount?: number;
  /** Change callback */
  onChange?: (toasts: Toast[]) => void;
}

let toastIdCounter = 0;

export function createToastManager(options: CreateToastOptions = {}): ToastApi {
  const defaultDuration = options.defaultDuration ?? 5000;
  const maxCount = options.maxCount ?? 5;
  let toasts: Toast[] = [];
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function notify() {
    options.onChange?.([...toasts]);
  }

  function add(message: string, variant: ToastVariant = "info", duration?: number): string {
    const id = `toast-${++toastIdCounter}`;
    const d = duration ?? defaultDuration;

    const toast: Toast = {
      id,
      message,
      variant,
      duration: d,
      createdAt: Date.now(),
    };

    toasts = [...toasts, toast].slice(-maxCount);
    notify();

    if (d > 0) {
      const timer = setTimeout(() => dismiss(id), d);
      timers.set(id, timer);
    }

    return id;
  }

  function dismiss(id: string) {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }

  function dismissAll() {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
    toasts = [];
    notify();
  }

  return {
    regionProps: {
      role: "status" as const,
      "aria-live": "polite" as const,
      "aria-label": "Notifications",
    },
    getToastProps: (_id: string) => ({
      role: "alert" as const,
      "aria-atomic": true as const,
    }),
    add,
    dismiss,
    dismissAll,
    toasts,
  };
}
