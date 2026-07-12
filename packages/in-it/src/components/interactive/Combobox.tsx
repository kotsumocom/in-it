/**
 * Combobox コンポーネント（hono/jsx/dom）
 * WAI-ARIA Combobox パターン準拠
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: (value: string) => void;
}

export function Combobox({
  options,
  value: controlledValue,
  placeholder = "検索...",
  label,
  onChange,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(controlledValue ?? "");
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;
  const enabledFiltered = filtered.filter((o) => !o.disabled);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = useCallback((value: string) => {
    const opt = options.find((o) => o.value === value);
    if (opt) {
      setSelected(value);
      setQuery(opt.label);
      setOpen(false);
      onChange?.(value);
    }
  }, [options, onChange]);

  const handleInput = useCallback((e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    setQuery(val);
    setSelected("");
    if (!open) setOpen(true);
    setHighlighted(0);
  }, [open]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHighlighted(0); }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => (i + 1) % enabledFiltered.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((i) => (i - 1 + enabledFiltered.length) % enabledFiltered.length);
        break;
      case "Enter":
        e.preventDefault();
        if (highlighted >= 0 && enabledFiltered[highlighted]) {
          handleSelect(enabledFiltered[highlighted].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  }, [open, highlighted, enabledFiltered, handleSelect]);

  return (
    <div class="sc-combobox" ref={ref}>
      {label && <label class="sc-combobox__label">{label}</label>}
      <input
        type="text"
        class="sc-combobox__input"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onInput={handleInput}
        onFocus={() => { if (!open) { setOpen(true); setHighlighted(0); }}}
        onKeyDown={handleKeyDown}
      />
      {open && filtered.length > 0 && (
        <div class="sc-combobox__dropdown" role="listbox">
          {filtered.map((opt) => {
            const idx = enabledFiltered.findIndex((e) => e.value === opt.value);
            return (
              <div
                key={opt.value}
                role="option"
                class={`sc-combobox__option${idx === highlighted ? " sc-combobox__option--highlighted" : ""}${selected === opt.value ? " sc-combobox__option--selected" : ""}${opt.disabled ? " sc-combobox__option--disabled" : ""}`}
                aria-selected={selected === opt.value}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                onMouseEnter={() => !opt.disabled && setHighlighted(idx)}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
      {open && filtered.length === 0 && (
        <div class="sc-combobox__dropdown">
          <div class="sc-combobox__empty">一致する項目がありません</div>
        </div>
      )}
    </div>
  );
}
