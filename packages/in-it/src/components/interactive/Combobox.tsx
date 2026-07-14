/**
 * Combobox component (hono/jsx/dom)
 * WAI-ARIA Combobox pattern
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { COMBOBOX_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
import { t } from "../../locale.ts";

/** Props for the Combobox component. */
export interface ComboboxProps {
  options: string[];
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: (value: string) => void;
}

/** Autocomplete text input with filterable dropdown options. */
export function Combobox({ options, value = "", placeholder, label, onChange }: ComboboxProps): any {
  injectCSS("ii-combobox", COMBOBOX_CSS);
  const resolvedPlaceholder = placeholder ?? t("search");
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const select = useCallback((val: string) => {
    setQuery(val);
    setOpen(false);
    onChange?.(val);
  }, [onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown") { setOpen(true); setFocusedIdx(0); e.preventDefault(); }
      return;
    }
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); setFocusedIdx((i) => Math.min(i + 1, filtered.length - 1)); break;
      case "ArrowUp": e.preventDefault(); setFocusedIdx((i) => Math.max(i - 1, 0)); break;
      case "Enter": e.preventDefault(); if (focusedIdx >= 0 && filtered[focusedIdx]) select(filtered[focusedIdx]); break;
      case "Escape": e.preventDefault(); setOpen(false); break;
    }
  }, [open, focusedIdx, filtered, select]);

  return (
    <div class="ii-combobox" ref={ref} onKeyDown={handleKeyDown}>
      {label && <label class="ii-combobox__label">{label}</label>}
      <input
        type="text"
        class="ii-combobox__input"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        placeholder={resolvedPlaceholder}
        value={query}
        onInput={(e: Event) => { setQuery((e.target as HTMLInputElement).value); setOpen(true); setFocusedIdx(0); }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <div class="ii-combobox__dropdown" role="listbox">
          {filtered.map((opt, i) => (
            <div
              key={opt}
              role="option"
              class={`ii-combobox__option${i === focusedIdx ? " ii-combobox__option--focused" : ""}`}
              aria-selected={i === focusedIdx}
              onClick={() => select(opt)}
              onMouseEnter={() => setFocusedIdx(i)}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}