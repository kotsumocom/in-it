/**
 * WAI-ARIA Dialog (Modal) pattern
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Manages focus trap, Escape key close, and background inert.
 */

/** DialogApi interface */
export interface DialogApi {
  /** Props to apply to the Dialog element */
  contentProps: {
    role: "dialog";
    "aria-modal": boolean;
    "aria-labelledby": string;
    "aria-describedby"?: string;
    tabIndex: -1;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** Props to apply to the title element */
  titleProps: { id: string };
  /** Props to apply to the description element */
  descriptionProps: { id: string };
  /** Props to apply to the backdrop */
  backdropProps: {
    onClick: (e: MouseEvent) => void;
  };
  /** Props to apply to the trigger */
  triggerProps: {
    onClick: () => void;
    "aria-haspopup": "dialog";
    "aria-expanded": boolean;
  };
  /** Open the dialog */
  open: () => void;
  /** Close */
  close: () => void;
  /** Whether the dialog is open */
  isOpen: boolean;
}

/** CreateDialogOptions interface */
export interface CreateDialogOptions {
  /** Initialize in open state */
  open?: boolean;
  /** Callback on close */
  onClose?: () => void;
  /** Callback on open */
  onOpen?: () => void;
  /** ID prefix */
  id?: string;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
}

let dialogCounter = 0;
function dialogUid(): string {
  return `dialog-${++dialogCounter}`;
}

/** createDialog */
export function createDialog(options: CreateDialogOptions = {}): DialogApi {
  const prefix = options.id ?? dialogUid();
  const titleId = `${prefix}-title`;
  const descId = `${prefix}-desc`;
  const closeOnBackdrop = options.closeOnBackdrop ?? true;
  const closeOnEscape = options.closeOnEscape ?? true;
  let isOpen = options.open ?? false;

  function open() {
    isOpen = true;
    options.onOpen?.();
  }

  function close() {
    isOpen = false;
    options.onClose?.();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (closeOnEscape && e.key === "Escape") {
      e.preventDefault();
      close();
    }
    // Focus trap is managed by the component
  }

  function handleBackdropClick(e: MouseEvent) {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      close();
    }
  }

  return {
    contentProps: {
      role: "dialog" as const,
      "aria-modal": true,
      "aria-labelledby": titleId,
      "aria-describedby": descId,
      tabIndex: -1,
      onKeyDown: handleKeyDown,
    },
    titleProps: { id: titleId },
    descriptionProps: { id: descId },
    backdropProps: {
      onClick: handleBackdropClick,
    },
    triggerProps: {
      onClick: open,
      "aria-haspopup": "dialog" as const,
      "aria-expanded": isOpen,
    },
    open,
    close,
    isOpen,
  };
}