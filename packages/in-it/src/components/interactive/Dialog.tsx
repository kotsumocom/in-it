/**
 * Dialog コンポーネント（hono/jsx/dom）
 * WAI-ARIA Dialog (Modal) パターン準拠
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";

export interface DialogProps {
  /** 開いているか */
  open: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
  /** タイトル */
  title?: string;
  /** 説明 */
  description?: string;
  /** バックドロップクリックで閉じる */
  closeOnBackdrop?: boolean;
  /** コンテンツ */
  children: any;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  closeOnBackdrop = true,
  children,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape キー
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

  // body スクロール防止
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
    <div class="sc-dialog__backdrop" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        class="sc-dialog"
        role="dialog"
        aria-modal={true}
        aria-labelledby={title ? "dialog-title" : undefined}
        tabIndex={-1}
      >
        {title && (
          <div class="sc-dialog__header">
            <h2 id="dialog-title" class="sc-dialog__title">{title}</h2>
            <button
              type="button"
              class="sc-dialog__close"
              aria-label="閉じる"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        )}
        {description && (
          <p class="sc-dialog__desc">{description}</p>
        )}
        <div class="sc-dialog__body">
          {children}
        </div>
      </div>
    </div>
  );
}
