/**
 * WAI-ARIA Tooltip pattern
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 *
 * Show on hover/focus, hide on Escape.
 */

/** TooltipApi interface */
export interface TooltipApi {
  /** Props to apply to the trigger element */
  triggerProps: {
    "aria-describedby": string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** Props to apply to the tooltip element */
  tooltipProps: {
    id: string;
    role: "tooltip";
  };
  /** Whether visible */
  isOpen: boolean;
  /** Open the tooltip */
  open: () => void;
  /** Close */
  close: () => void;
}

/** CreateTooltipOptions interface */
export interface CreateTooltipOptions {
  /** Show delay (ms) */
  delay?: number;
  /** ID prefix */
  id?: string;
  /** Open/close callback */
  onOpenChange?: (open: boolean) => void;
}

let tooltipCounter = 0;

/** createTooltip */
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