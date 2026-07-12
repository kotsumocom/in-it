/**
 * Select コンポーネント（hono/jsx/dom）
 * WAI-ARIA Listbox パターン準拠
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
  onChange?: (value: string) => void;
}

export function Select({
  options,
  value: controlledValue,
  placeholder = "選択してください",
  label,
  onChange,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(controlledValue ?? "");
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const enabledOptions = options.filter((o) => !o.disabled);
  const selectedOption = options.find((o) => o.value === selected);

  // 外側クリック
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = useCallback((value: string) => {
    setSelected(value);
    setOpen(false);
    onChange?.(value);
  }, [onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        setHighlighted(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => (i + 1) % enabledOptions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((i) => (i - 1 + enabledOptions.length) % enabledOptions.length);
        break;
      case "Home":
        e.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        e.preventDefault();
        setHighlighted(enabledOptions.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlighted >= 0) handleSelect(enabledOptions[highlighted].value);
        break;
      case "Escape":
      case "Tab":
        e.preventDefault();
        setOpen(false);
        break;
    }
  }, [open, highlighted, enabledOptions, handleSelect]);

  return (
    <div class="sc-select" ref={containerRef} onKeyDown={handleKeyDown}>
      {label && <label class="sc-select__label">{label}</label>}
      <button
        type="button"
        class="sc-select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => { setOpen((v) => !v); if (!open) setHighlighted(0); }}
      >
        <span class={`sc-select__value${!selectedOption ? " sc-select__value--placeholder" : ""}`}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span class="sc-select__arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div class="sc-select__dropdown" role="listbox">
          {options.map((opt) => {
            const enabledIdx = enabledOptions.findIndex((e) => e.value === opt.value);
            return (
              <div
                key={opt.value}
                role="option"
                class={`sc-select__option${enabledIdx === highlighted ? " sc-select__option--highlighted" : ""}${selected === opt.value ? " sc-select__option--selected" : ""}${opt.disabled ? " sc-select__option--disabled" : ""}`}
                aria-selected={selected === opt.value}
                aria-disabled={opt.disabled || undefined}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                onMouseEnter={() => !opt.disabled && setHighlighted(enabledIdx)}
              >
                {opt.label}
                {selected === opt.value && <span class="sc-select__check">✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
