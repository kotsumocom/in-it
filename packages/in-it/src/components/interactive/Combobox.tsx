/**
 * Combobox component (hono/jsx/dom)
 * WAI-ARIA Combobox pattern
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { useLabels } from "../../locale.ts";
import type { LocaleStrings } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Combobox — co-located for self-containment. */
export const COMBOBOX_CSS = `/* --- Combobox --- */
.ii-combobox {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
  position: relative;
}
.ii-combobox__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
.ii-combobox__input {
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  transition: border-color var(--ii-transition);
}
.ii-combobox__input:hover { border-color: var(--ii-outline); }
.ii-combobox__input:focus {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
  border-color: var(--ii-primary);
}
.ii-combobox__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md);
  padding: 4px;
  z-index: 50;
  max-height: 240px;
  overflow-y: auto;
  animation: ii-fade-in 100ms ease;
}
.ii-combobox__option {
  padding: 8px 12px;
  border-radius: var(--ii-shape-sm);
  cursor: pointer;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
}
.ii-combobox__option:hover, .ii-combobox__option--highlighted {
  background: var(--ii-surface-container-high);
}
.ii-combobox__option--selected {
  color: var(--ii-primary);
  font-weight: 500;
}
.ii-combobox__option--disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-combobox__empty {
  padding: 12px;
  text-align: center;
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-sm);
}
`;

/** Props for the Combobox component. */
export interface ComboboxProps {
  options: string[];
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: (value: string) => void;
  /** Override built-in locale strings. */
  labels?: Partial<Pick<LocaleStrings, "search">>;
}

/** Autocomplete text input with filterable dropdown options. */
export function Combobox({ options, value = "", placeholder, label, onChange, labels: labelOverrides }: ComboboxProps): any {
  injectCSS("ii-combobox", COMBOBOX_CSS);
  const l = useLabels(["search"] as const, labelOverrides);
  const resolvedPlaceholder = placeholder ?? l.search;
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