/**
 * WAI-ARIA Non-modal Dialog パターン（Popover）
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */

export interface PopoverApi {
  triggerProps: {
    "aria-haspopup": "dialog";
    "aria-expanded": boolean;
    "aria-controls": string;
    onClick: () => void;
  };
  popoverProps: {
    id: string;
    role: "dialog";
    "aria-modal": false;
    "aria-labelledby"?: string;
    tabIndex: -1;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface CreatePopoverOptions {
  id?: string;
  onOpenChange?: (open: boolean) => void;
}

let popoverCounter = 0;

export function createPopover(opts: CreatePopoverOptions = {}): PopoverApi {
  const prefix = opts.id ?? `popover-${++popoverCounter}`;
  const triggerId = `${prefix}-trigger`;
  const popoverId = `${prefix}-content`;
  let isOpen = false;

  function open() {
    isOpen = true;
    opts.onOpenChange?.(true);
  }

  function close() {
    isOpen = false;
    opts.onOpenChange?.(false);
  }

  function toggle() {
    isOpen ? close() : open();
  }

  return {
    triggerProps: {
      "aria-haspopup": "dialog" as const,
      "aria-expanded": isOpen,
      "aria-controls": popoverId,
      onClick: toggle,
    },
    popoverProps: {
      id: popoverId,
      role: "dialog" as const,
      "aria-modal": false as const,
      "aria-labelledby": triggerId,
      tabIndex: -1,
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
        }
      },
    },
    isOpen,
    open,
    close,
    toggle,
  };
}
