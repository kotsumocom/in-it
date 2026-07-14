/**
 * Popover component (hono/jsx/dom)
 * WAI-ARIA Dialog (Non-modal) pattern
 */
import { useState, useEffect, useRef } from "hono/jsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Popover — co-located for self-containment. */
export const POPOVER_CSS = `/* --- Popover --- */
.ii-popover {
  position: relative;
  display: inline-block;
}
.ii-popover__trigger {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: var(--ii-on-surface);
}
.ii-popover__content {
  position: absolute;
  top: 100%;
  margin-top: 8px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  box-shadow: var(--ii-shadow-lg);
  padding: var(--ii-spacing-4);
  min-width: 240px;
  z-index: 50;
  animation: ii-slide-up 150ms ease;
}
.ii-popover__content--left { left: 0; }
.ii-popover__content--right { right: 0; }
.ii-popover__content--center { left: 50%; transform: translateX(-50%); }
`;

/** Props for the Popover component. */
export interface PopoverProps {
  trigger: any;
  children: any;
  position?: "top" | "bottom" | "left" | "right";
}

/** Non-modal floating content triggered by a button click. */
export function Popover({ trigger, children, position = "bottom" }: PopoverProps): any {
  injectCSS("ii-popover", POPOVER_CSS);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div class="ii-popover" ref={ref}>
      <div class="ii-popover__trigger" onClick={() => setOpen((v) => !v)}>
        {trigger}
      </div>
      {open && (
        <div class={`ii-popover__content ii-popover__content--${position}`} role="dialog">
          {children}
        </div>
      )}
    </div>
  );
}