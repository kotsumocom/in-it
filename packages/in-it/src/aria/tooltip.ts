/**
 * WAI-ARIA Tooltip パターン
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 *
 * ホバー/フォーカスで表示、Escape で非表示。
 */

export interface TooltipApi {
  /** トリガー要素に適用する props */
  triggerProps: {
    "aria-describedby": string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** ツールチップ要素に適用する props */
  tooltipProps: {
    id: string;
    role: "tooltip";
  };
  /** 表示中か */
  isOpen: boolean;
  /** 開く */
  open: () => void;
  /** 閉じる */
  close: () => void;
}

export interface CreateTooltipOptions {
  /** 表示遅延 (ms) */
  delay?: number;
  /** ID プレフィックス */
  id?: string;
  /** 開閉コールバック */
  onOpenChange?: (open: boolean) => void;
}

let tooltipCounter = 0;

export function createTooltip(options: CreateTooltipOptions = {}): TooltipApi {
  const tooltipId = options.id ?? `tooltip-${++tooltipCounter}`;
  let isOpen = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const delay = options.delay ?? 300;

  function open() {
    timer = setTimeout(() => {
      isOpen = true;
      options.onOpenChange?.(true);
    }, delay);
  }

  function close() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    isOpen = false;
    options.onOpenChange?.(false);
  }

  return {
    triggerProps: {
      "aria-describedby": tooltipId,
      onMouseEnter: open,
      onMouseLeave: close,
      onFocus: open,
      onBlur: close,
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      },
    },
    tooltipProps: {
      id: tooltipId,
      role: "tooltip" as const,
    },
    isOpen,
    open,
    close,
  };
}
