/**
 * Dialog component (hono/jsx/dom)
 * WAI-ARIA Dialog (Modal) pattern
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { DIALOG_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
import { t } from "../../locale.ts";

/** Props for the Dialog component. */
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  closeOnBackdrop?: boolean;
  children: any;
}

/** Modal dialog overlay with backdrop and close button. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  closeOnBackdrop = true,
  children,
}: DialogProps): any {
  injectCSS("ii-dialog", DIALOG_CSS);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: Event) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose],
  );

  if (!open) return null;

  return (
    <div class="ii-dialog__backdrop" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        class="ii-dialog"
        role="dialog"
        aria-modal={true}
        aria-labelledby={title ? "dialog-title" : undefined}
        tabIndex={-1}
      >
        {title && (
          <div class="ii-dialog__header">
            <h2 id="dialog-title" class="ii-dialog__title">{title}</h2>
            <button type="button" class="ii-dialog__close" aria-label={t("close")} onClick={onClose}>
              x
            </button>
          </div>
        )}
        {description && (
          <p class="ii-dialog__desc">{description}</p>
        )}
        <div class="ii-dialog__body">
          {children}
        </div>
      </div>
    </div>
  );
}