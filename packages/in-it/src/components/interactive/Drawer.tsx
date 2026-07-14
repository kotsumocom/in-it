/**
 * Drawer component - slide panel
 */
import { useState, useEffect, useCallback } from "hono/jsx";
import { DRAWER_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
import { t } from "../../locale.ts";

/** Props for the Drawer component. */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  position?: "left" | "right";
  title?: string;
  width?: string;
  children: any;
}

/** Slide-in panel for navigation or detail views. */
export function Drawer({ open, onClose, position = "right", title, width = "320px", children }: DrawerProps): any {
  injectCSS("ii-drawer", DRAWER_CSS);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div class="ii-drawer__backdrop" onClick={(e: Event) => { if (e.target === e.currentTarget) onClose(); }}>
      <div class={`ii-drawer ii-drawer--${position}`} role="dialog" aria-modal={true} style={{ width }}>
        <div class="ii-drawer__header">
          {title && <h2 class="ii-drawer__title">{title}</h2>}
          <button type="button" class="ii-drawer__close" aria-label={t("close")} onClick={onClose}>x</button>
        </div>
        <div class="ii-drawer__body">{children}</div>
      </div>
    </div>
  );
}