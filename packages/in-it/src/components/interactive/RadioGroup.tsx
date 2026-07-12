/**
 * RadioGroup コンポーネント
 */
import { useState, useCallback } from "hono/jsx";

export interface RadioOption { value: string; label: string; disabled?: boolean; }

export interface RadioGroupProps {
  name?: string;
  options: RadioOption[];
  value?: string;
  orientation?: "vertical" | "horizontal";
  onChange?: (value: string) => void;
}

export function RadioGroup({ name, options, value: controlledValue, orientation = "vertical", onChange }: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");
  const value = controlledValue ?? internalValue;

  const select = useCallback((v: string) => { setInternalValue(v); onChange?.(v); }, [onChange]);

  return (
    <div class={`sc-radio-group${orientation === "horizontal" ? " sc-radio-group--horizontal" : ""}`} role="radiogroup">
      {options.map((opt) => (
        <label key={opt.value} class={`sc-radio${opt.disabled ? " sc-radio--disabled" : ""}`}>
          <span class={`sc-radio__control${value === opt.value ? " sc-radio__control--checked" : ""}`} />
          <input type="radio" name={name} value={opt.value} checked={value === opt.value}
            disabled={opt.disabled} onChange={() => !opt.disabled && select(opt.value)}
            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
          <span class="sc-radio__label">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
