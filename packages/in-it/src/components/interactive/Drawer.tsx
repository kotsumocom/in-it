/**
 * Drawer 繧ｳ繝ｳ繝昴・繝阪Φ繝茨ｼ医せ繝ｩ繧､繝峨ヱ繝阪Ν・・ */
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
      <div class="ii-drawer-overlay" onClick={onClose} />
      <div class={`ii-drawer ii-drawer--${side}`} ref={drawerRef} role="dialog" aria-modal={true}>
        <div class="ii-drawer__header">
          <span class="ii-drawer__title">{title}</span>
          <button type="button" class="ii-drawer__close" aria-label="髢峨§繧・ onClick={onClose}>笨・/button>
        </div>
        <div class="ii-drawer__body">{children}</div>
        {footer && <div class="ii-drawer__footer">{footer}</div>}
      </div>
    </>
  );
}

