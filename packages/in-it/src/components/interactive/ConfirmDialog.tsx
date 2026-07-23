/**
 * ConfirmDialog — Confirmation dialog for destructive or important actions.
 *
 * Wraps Dialog with a simplified API for confirm/cancel actions.
 * Uses role="alertdialog" for accessibility (WAI-ARIA alert dialog pattern).
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   open={confirmOpen}
 *   onClose={() => setConfirmOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete item"
 *   description="This action cannot be undone."
 *   variant="danger"
 *   confirmLabel="Delete"
 * />
 * ```
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { useLabels } from "../../locale.ts";
import type { LocaleStrings } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";
import { DIALOG_CSS } from "./Dialog.tsx";

/** @internal CSS for ConfirmDialog — extends Dialog CSS. */
export const CONFIRM_DIALOG_CSS = `/* --- ConfirmDialog --- */
.ii-confirm-dialog__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--ii-spacing-2);
  margin-top: var(--ii-spacing-5);
}
.ii-confirm-dialog__btn--danger {
  background: var(--ii-error);
  color: var(--ii-on-error);
}
.ii-confirm-dialog__btn--danger:hover {
  opacity: 0.9;
}
.ii-confirm-dialog__btn--warning {
  background: var(--ii-warning, #f59e0b);
  color: #fff;
}
.ii-confirm-dialog__btn--warning:hover {
  opacity: 0.9;
}
`;

/** Visual variant for the confirm button. */
export type ConfirmDialogVariant = "danger" | "warning" | "info";

/** Props for the {@link ConfirmDialog} component. */
export interface ConfirmDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when the dialog is closed (cancel or backdrop click). */
  onClose: () => void;
  /** Called when the confirm button is clicked. */
  onConfirm: () => void | Promise<void>;
  /** Dialog title. */
  title: string;
  /** Optional description text. */
  description?: string;
  /** Visual variant for the confirm button. */
  variant?: ConfirmDialogVariant;
  /** Confirm button label. Defaults to locale "confirm". */
  confirmLabel?: string;
  /** Cancel button label. Defaults to locale "cancel". */
  cancelLabel?: string;
  /** Whether the confirm action is in progress. */
  loading?: boolean;
  /** Override built-in locale strings. */
  labels?: Partial<Pick<LocaleStrings, "close">>;
}

/** Confirmation dialog for destructive or important actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  variant = "info",
  confirmLabel,
  cancelLabel,
  loading = false,
  labels: labelOverrides,
}: ConfirmDialogProps): any {
  injectCSS("ii-dialog", DIALOG_CSS);
  injectCSS("ii-confirm-dialog", CONFIRM_DIALOG_CSS);
  const l = useLabels<"close" | "confirm" | "cancel">(["close", "confirm", "cancel"], labelOverrides);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Keyboard handling
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

  // Prevent body scroll
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
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const handleConfirm = useCallback(async () => {
    await onConfirm();
  }, [onConfirm]);

  if (!open) return null;

  const confirmBtnClass = variant === "info"
    ? "ii-btn ii-btn--filled"
    : `ii-btn ii-btn--filled ii-confirm-dialog__btn--${variant}`;

  return (
    <div class="ii-dialog__backdrop" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        class="ii-dialog"
        role="alertdialog"
        aria-modal={true}
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? "confirm-dialog-desc" : undefined}
        tabIndex={-1}
      >
        <div class="ii-dialog__header">
          <h2 id="confirm-dialog-title" class="ii-dialog__title">{title}</h2>
          <button type="button" class="ii-dialog__close" aria-label={l.close} onClick={onClose}>
            ×
          </button>
        </div>
        {description && (
          <p id="confirm-dialog-desc" class="ii-dialog__desc">{description}</p>
        )}
        <div class="ii-confirm-dialog__actions">
          <button
            type="button"
            class="ii-btn ii-btn--text"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel ?? l.cancel ?? "キャンセル"}
          </button>
          <button
            type="button"
            class={confirmBtnClass}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "..." : (confirmLabel ?? l.confirm ?? "確認")}
          </button>
        </div>
      </div>
    </div>
  );
}
