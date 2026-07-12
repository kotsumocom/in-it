/**
 * Popover 繧ｳ繝ｳ繝昴・繝阪Φ繝茨ｼ・ono/jsx/dom・・ * WAI-ARIA Non-modal Dialog 繝代ち繝ｼ繝ｳ
 */
import { useState, useEffect, useRef } from "hono/jsx";

export interface PopoverProps {
  trigger: any;
  children: any;
  align?: "left" | "right" | "center";
}

export function Popover({ trigger, children, align = "left" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [open]);

  return (
    <div class="ii-popover" ref={ref}>
      <button
        type="button"
        class="ii-popover__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </button>
      {open && (
        <div class={`ii-popover__content ii-popover__content--${align}`} role="dialog" aria-modal={false}>
          {children}
        </div>
      )}
    </div>
  );
}

