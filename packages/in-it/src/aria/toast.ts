/**
 * WAI-ARIA Alert + Live Region パターン（Toast）
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 *
 * スクリーンリーダーに通知を伝えるための aria-live 管理。
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
  /** トーストコンテナに適用する props */
  regionProps: {
    role: "status";
    "aria-live": "polite";
    "aria-label": string;
  };
  /** 各トーストの props を取得 */
  getToastProps: (id: string) => {
    role: "alert";
    "aria-atomic": true;
  };
  /** トーストを追加 */
  add: (message: string, variant?: ToastVariant, duration?: number) => string;
  /** トーストを削除 */
  dismiss: (id: string) => void;
  /** 全削除 */
  dismissAll: () => void;
  /** 現在のトースト一覧 */
  toasts: Toast[];
}

export interface CreateToastOptions {
  /** デフォルト表示時間 (ms) */
  defaultDuration?: number;
  /** 最大表示数 */
  maxCount?: number;
  /** 変更コールバック */
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
      "aria-label": "通知",
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
