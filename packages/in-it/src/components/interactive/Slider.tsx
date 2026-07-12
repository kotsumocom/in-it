/**
 * Slider — Range slider component
 */
import { useState } from "hono/jsx";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  label?: string;
  showValue?: boolean;
  onChange?: (value: number) => void;
}

export function Slider({ min = 0, max = 100, step = 1, defaultValue = 50, label, showValue = true, onChange }: SliderProps) {
  const [value, setValue] = useState(defaultValue);

  const handleInput = (e: Event) => {
    const v = Number((e.target as HTMLInputElement).value);
    setValue(v);
    onChange?.(v);
  };

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div class="ii-slider">
      {label && (
        <div class="ii-slider__header">
          <label class="ii-slider__label">{label}</label>
          {showValue && <span class="ii-slider__value">{value}</span>}
        </div>
      )}
      <input type="range" class="ii-slider__input" min={min} max={max} step={step} value={value}
        onInput={handleInput}
        style={{ background: `linear-gradient(to right, var(--ii-primary) ${pct}%, var(--ii-surface-container-high) ${pct}%)` }}
      />
    </div>
  );
}
