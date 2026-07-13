/**
 * Select component (hono/jsx/dom)
 * WAI-ARIA Listbox pattern
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export function Select({ options, value, placeholder = "Select...", label, disabled, onChange }: SelectProps): any {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? "");
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const enabledOptions = options.filter((o) => !o.disabled);
  const selectedLabel = options.find((o) => o.value === selected)?.label ?? placeholder;

  // Close on outside click
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

  const handleSelect = useCallback((val: string) => {
    setSelected(val);
    setOpen(false);
    onChange?.(val);
  }, [onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        setFocusedIdx(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, enabledOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setFocusedIdx(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIdx(enabledOptions.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIdx >= 0) handleSelect(enabledOptions[focusedIdx].value);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  }, [open, focusedIdx, enabledOptions, handleSelect]);

  return (
    <div class={`ii-select${disabled ? " ii-select--disabled" : ""}`} ref={ref} onKeyDown={handleKeyDown}>
      {label && <label class="ii-select__label">{label}</label>}
      <button
        type="button"
        class={`ii-select__trigger${open ? " ii-select__trigger--open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => { if (!disabled) setOpen((v) => !v); }}
      >
        <span class="ii-select__value">{selectedLabel}</span>
        <span class="ii-select__arrow">{open ? "^" : "v"}</span>
      </button>
      {open && (
        <div class="ii-select__dropdown" role="listbox">
          {options.map((opt, i) => {
            const enabledIdx = enabledOptions.findIndex((e) => e.value === opt.value);
            return (
              <div
                key={opt.value}
                role="option"
                class={`ii-select__option${enabledIdx === focusedIdx ? " ii-select__option--focused" : ""}${opt.value === selected ? " ii-select__option--selected" : ""}${opt.disabled ? " ii-select__option--disabled" : ""}`}
                aria-selected={opt.value === selected}
                aria-disabled={opt.disabled}
                onClick={() => { if (!opt.disabled) handleSelect(opt.value); }}
                onMouseEnter={() => { if (!opt.disabled) setFocusedIdx(enabledIdx); }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
