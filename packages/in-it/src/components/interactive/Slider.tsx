/**
 * Range slider component
 */
import { useState } from "hono/jsx";

/** @internal CSS for Slider — co-located for self-containment. */
export const SLIDER_CSS = `/* --- Slider --- */
.ii-slider { display: flex; flex-direction: column; gap: 8px; }
.ii-slider__label { display: flex; justify-content: space-between; font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-slider__track { position: relative; height: 4px; background: var(--ii-outline-variant); border-radius: 2px; cursor: pointer; }
.ii-slider__fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--ii-primary); border-radius: 2px; }
.ii-slider__thumb {
  position: absolute; top: 50%; width: 20px; height: 20px; border-radius: 50%;
  background: var(--ii-primary); transform: translate(-50%, -50%); cursor: grab;
  box-shadow: var(--ii-shadow-sm); transition: box-shadow var(--ii-transition);
}
.ii-slider__thumb:hover { box-shadow: 0 0 0 8px color-mix(in srgb, var(--ii-primary) 12%, transparent); }
.ii-slider__thumb:active { cursor: grabbing; }
`;

/** Props for the Slider component. */
export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  label?: string;
  showValue?: boolean;
  onChange?: (value: number) => void;
}

/** Range slider input with optional label and value display. */
export function Slider({ min = 0, max = 100, step = 1, defaultValue = 50, label, showValue = true, onChange }: SliderProps): any {
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