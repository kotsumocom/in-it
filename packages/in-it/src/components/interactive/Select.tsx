/**
 * Select component (hono/jsx/dom)
 * WAI-ARIA Listbox pattern
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Select — co-located for self-containment. */
export const SELECT_CSS = `/* --- Select --- */
.ii-select {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
  position: relative;
}
.ii-select__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
.ii-select__label--required::after {
  content: ' *';
  color: var(--ii-error);
}
.ii-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  cursor: pointer;
  transition: border-color var(--ii-transition);
}
.ii-select__trigger:hover { border-color: var(--ii-outline); }
.ii-select__trigger:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
}
.ii-select__value--placeholder { color: var(--ii-on-surface-variant); }
.ii-select__arrow {
  font-size: 0.7rem;
  color: var(--ii-on-surface-variant);
  margin-left: var(--ii-spacing-2);
}
.ii-select__dropdown {
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
.ii-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--ii-shape-sm);
  cursor: pointer;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
}
.ii-select__option:hover, .ii-select__option--highlighted {
  background: var(--ii-surface-container-high);
}
.ii-select__option--selected {
  color: var(--ii-primary);
  font-weight: 500;
}
.ii-select__option--disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-select__check {
  color: var(--ii-primary);
  font-weight: 600;
}
`;

/** A single option in the select dropdown. */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Props for the Select component. */
export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  /** Whether the field is required. */
  required?: boolean;
  onChange?: (value: string) => void;
}

/** Custom select dropdown with keyboard navigation and ARIA listbox pattern. */
export function Select({ options, value, placeholder = "Select...", label, disabled, required, onChange }: SelectProps): any {
  injectCSS("ii-select", SELECT_CSS);
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
      {label && <label class={`ii-select__label${required ? " ii-select__label--required" : ""}`}>{label}</label>}
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