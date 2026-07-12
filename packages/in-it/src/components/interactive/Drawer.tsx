/**
 * Drawer コンポーネント（スライドパネル）
 */
import { useEffect, useRef } from "hono/jsx";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "left" | "right" | "top" | "bottom";
  children: any;
  footer?: any;
}

export function Drawer({ open, onClose, title, side = "right", children, footer }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div class="sc-drawer-overlay" onClick={onClose} />
      <div class={`sc-drawer sc-drawer--${side}`} ref={drawerRef} role="dialog" aria-modal={true}>
        <div class="sc-drawer__header">
          <span class="sc-drawer__title">{title}</span>
          <button type="button" class="sc-drawer__close" aria-label="閉じる" onClick={onClose}>✕</button>
        </div>
        <div class="sc-drawer__body">{children}</div>
        {footer && <div class="sc-drawer__footer">{footer}</div>}
      </div>
    </>
  );
}
