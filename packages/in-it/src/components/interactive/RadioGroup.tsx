/**
 * RadioGroup component
 */
import { useState, useCallback } from "hono/jsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for RadioGroup — co-located for self-containment. */
export const RADIO_GROUP_CSS = `/* --- Radio Group --- */
.ii-radio-group { display: flex; flex-direction: column; gap: 8px; }
.ii-radio-group--horizontal { flex-direction: row; gap: 16px; }
.ii-radio { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.ii-radio--disabled { cursor: not-allowed; opacity: 0.38; }
.ii-radio__control {
  width: 20px; height: 20px; border: 2px solid var(--ii-on-surface-variant);
  border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: all var(--ii-transition);
}
.ii-radio__control--checked { border-color: var(--ii-primary); }
.ii-radio__control--checked::after {
  content: ''; width: 10px; height: 10px; border-radius: 50%; background: var(--ii-primary);
}
.ii-radio__control:hover { border-color: var(--ii-on-surface); }
.ii-radio__label { font-size: var(--ii-font-base); color: var(--ii-on-surface); }
`;

/** A single radio button option. */
export interface RadioOption { value: string; label: string; disabled?: boolean; }

/** Props for the RadioGroup component. */
export interface RadioGroupProps {
  name?: string;
  options: RadioOption[];
  value?: string;
  orientation?: "vertical" | "horizontal";
  onChange?: (value: string) => void;
}

/** A group of mutually exclusive radio buttons. */
export function RadioGroup({ name, options, value: controlledValue, orientation = "vertical", onChange }: RadioGroupProps): any {
  injectCSS("ii-radio", RADIO_GROUP_CSS);
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");
  const value = controlledValue ?? internalValue;

  const select = useCallback((v: string) => { setInternalValue(v); onChange?.(v); }, [onChange]);

  return (
    <div class={`ii-radio-group${orientation === "horizontal" ? " ii-radio-group--horizontal" : ""}`} role="radiogroup">
      {options.map((opt) => (
        <label key={opt.value} class={`ii-radio${opt.disabled ? " ii-radio--disabled" : ""}`}>
          <span class={`ii-radio__control${value === opt.value ? " ii-radio__control--checked" : ""}`} />
          <input type="radio" name={name} value={opt.value} checked={value === opt.value}
            disabled={opt.disabled} onChange={() => !opt.disabled && select(opt.value)}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
          <span class="ii-radio__label">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
