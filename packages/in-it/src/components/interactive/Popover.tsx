/**
 * Popover component (hono/jsx/dom)
 * WAI-ARIA Dialog (Non-modal) pattern
 */
import { useState, useEffect, useRef } from "hono/jsx";

/** PopoverProps interface */
export interface PopoverProps {
  trigger: any;
  children: any;
  position?: "top" | "bottom" | "left" | "right";
}

/** Popover */
export function Popover({ trigger, children, position = "bottom" }: PopoverProps): any {
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