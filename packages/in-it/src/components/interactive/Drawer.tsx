/**
 * Drawer component - slide panel
 */
import { useState, useEffect, useCallback } from "hono/jsx";
import { t } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Drawer — co-located for self-containment. */
export const DRAWER_CSS = `/* --- Drawer --- */
.ii-drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 100;
  animation: ii-fade-in 200ms ease;
}
.ii-drawer {
  position: fixed; z-index: 101; background: var(--ii-surface);
  box-shadow: var(--ii-shadow-lg); display: flex; flex-direction: column;
}
.ii-drawer--left { top: 0; bottom: 0; left: 0; width: 320px; animation: ii-slide-in-left 200ms ease; }
.ii-drawer--right { top: 0; bottom: 0; right: 0; width: 320px; animation: ii-slide-in-right 200ms ease; }
.ii-drawer--top { top: 0; left: 0; right: 0; height: 320px; animation: ii-slide-in-top 200ms ease; }
.ii-drawer--bottom { bottom: 0; left: 0; right: 0; height: 320px; animation: ii-slide-in-bottom 200ms ease; }
.ii-drawer__header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--ii-outline-variant); }
.ii-drawer__title { font-size: var(--ii-font-lg); font-weight: 600; }
.ii-drawer__close { background: none; border: none; cursor: pointer; font-size: 1.25rem; color: var(--ii-on-surface-variant); }
.ii-drawer__body { flex: 1; padding: 20px; overflow-y: auto; }
.ii-drawer__footer { padding: 16px 20px; border-top: 1px solid var(--ii-outline-variant); }
@keyframes ii-slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes ii-slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes ii-slide-in-top { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes ii-slide-in-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
`;

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