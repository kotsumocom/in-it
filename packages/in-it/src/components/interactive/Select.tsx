/**
 * Select 繧ｳ繝ｳ繝昴・繝阪Φ繝茨ｼ・ono/jsx/dom・・ * WAI-ARIA Listbox 繝代ち繝ｼ繝ｳ貅匁侠
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
  placeholder = "驕ｸ謚槭＠縺ｦ縺上□縺輔＞",
  label,
  onChange,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(controlledValue ?? "");
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const enabledOptions = options.filter((o) => !o.disabled);
  const selectedOption = options.find((o) => o.value === selected);

  // 螟門・繧ｯ繝ｪ繝・け
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
    <div class="ii-select" ref={containerRef} onKeyDown={handleKeyDown}>
      {label && <label class="ii-select__label">{label}</label>}
      <button
        type="button"
        class="ii-select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => { setOpen((v) => !v); if (!open) setHighlighted(0); }}
      >
        <span class={`ii-select__value${!selectedOption ? " ii-select__value--placeholder" : ""}`}>
          {selectedOption?.label ?? placeholder}
        </span>
        <span class="ii-select__arrow">{open ? "笆ｲ" : "笆ｼ"}</span>
      </button>

      {open && (
        <div class="ii-select__dropdown" role="listbox">
          {options.map((opt) => {
            const enabledIdx = enabledOptions.findIndex((e) => e.value === opt.value);
            return (
              <div
                key={opt.value}
                role="option"
                class={`ii-select__option${enabledIdx === highlighted ? " ii-select__option--highlighted" : ""}${selected === opt.value ? " ii-select__option--selected" : ""}${opt.disabled ? " ii-select__option--disabled" : ""}`}
                aria-selected={selected === opt.value}
                aria-disabled={opt.disabled || undefined}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                onMouseEnter={() => !opt.disabled && setHighlighted(enabledIdx)}
              >
                {opt.label}
                {selected === opt.value && <span class="ii-select__check">笨・/span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

