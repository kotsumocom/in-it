/**
 * Dialog 繧ｳ繝ｳ繝昴・繝阪Φ繝茨ｼ・ono/jsx/dom・・ * WAI-ARIA Dialog (Modal) 繝代ち繝ｼ繝ｳ貅匁侠
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";

export interface DialogProps {
  /** 髢九＞縺ｦ縺・ｋ縺・*/
  open: boolean;
  /** 髢峨§繧九さ繝ｼ繝ｫ繝舌ャ繧ｯ */
  onClose: () => void;
  /** 繧ｿ繧､繝医Ν */
  title?: string;
  /** 隱ｬ譏・*/
  description?: string;
  /** 繝舌ャ繧ｯ繝峨Ο繝・・繧ｯ繝ｪ繝・け縺ｧ髢峨§繧・*/
  closeOnBackdrop?: boolean;
  /** 繧ｳ繝ｳ繝・Φ繝・*/
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

  // Escape 繧ｭ繝ｼ
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

  // body 繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ髦ｲ豁｢
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
            <button
              type="button"
              class="ii-dialog__close"
              aria-label="髢峨§繧・
              onClick={onClose}
            >
              笨・            </button>
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

