/**
 * Dialog component (hono/jsx/dom)
 * WAI-ARIA Dialog (Modal) pattern
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { useLabels } from "../../locale.ts";
import type { LocaleStrings } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Dialog — co-located for self-containment. */
export const DIALOG_CSS = `/* --- Dialog --- */
.ii-dialog__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ii-fade-in 150ms ease;
}
.ii-dialog {
  background: var(--ii-surface);
  border-radius: var(--ii-shape-lg);
  padding: var(--ii-spacing-6);
  min-width: 360px;
  max-width: 560px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
  animation: ii-slide-up 200ms ease;
}
.ii-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ii-spacing-4);
}
.ii-dialog__title {
  font-size: var(--ii-font-xl);
  font-weight: 600;
}
.ii-dialog__close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--ii-on-surface-variant);
  padding: var(--ii-spacing-2);
  border-radius: var(--ii-shape-sm);
}
.ii-dialog__close:hover { background: var(--ii-surface-container-high); }
.ii-dialog__desc {
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-base);
  margin-bottom: var(--ii-spacing-4);
}
.ii-dialog__body { }
@keyframes ii-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ii-slide-up {
  from { transform: translateY(16px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
`;

/** Props for the Dialog component. */
export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  closeOnBackdrop?: boolean;
  children: any;
  /** Override built-in locale strings. */
  labels?: Partial<Pick<LocaleStrings, "close">>;
}

/** Modal dialog overlay with backdrop and close button. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  closeOnBackdrop = true,
  children,
  labels: labelOverrides,
}: DialogProps): any {
  injectCSS("ii-dialog", DIALOG_CSS);
  const l = useLabels(["close"] as const, labelOverrides);
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
            <button type="button" class="ii-dialog__close" aria-label={l.close} onClick={onClose}>
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