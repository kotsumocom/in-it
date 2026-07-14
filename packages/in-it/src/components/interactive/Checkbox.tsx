/**
 * Checkbox component
 */
import { useState } from "hono/jsx";

/** @internal CSS for Checkbox — co-located for self-containment. */
export const CHECKBOX_CSS = `/* --- Checkbox --- */
.ii-checkbox { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; }
.ii-checkbox--disabled { cursor: not-allowed; opacity: 0.38; }
.ii-checkbox__control {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border: 2px solid var(--ii-on-surface-variant);
  border-radius: 4px; background: transparent; color: transparent; flex-shrink: 0;
  transition: all var(--ii-transition);
}
.ii-checkbox__control--checked, .ii-checkbox__control--indeterminate {
  background: var(--ii-primary); border-color: var(--ii-primary); color: var(--ii-on-primary);
}
.ii-checkbox__control:hover { border-color: var(--ii-on-surface); }
.ii-checkbox__indicator { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-size: 0.7rem; }
.ii-checkbox__label { font-size: var(--ii-font-base); color: var(--ii-on-surface); }
.ii-checkbox__input { position: absolute; opacity: 0; width: 0; height: 0; }
`;

/** Props for the Checkbox component. */
export interface CheckboxProps {
  label?: string;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

/** A checkbox input with optional indeterminate state. */
export function Checkbox({ label, defaultChecked = false, indeterminate = false, disabled, onChange }: CheckboxProps): any {
  const [checked, setChecked] = useState(defaultChecked);

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <label class={`ii-checkbox${disabled ? " ii-checkbox--disabled" : ""}`}>
      <input
        type="checkbox"
        class="ii-checkbox__input"
        checked={checked}
        disabled={disabled}
        onChange={toggle}
        aria-checked={indeterminate ? "mixed" : checked}
      />
      <span class="ii-checkbox__control">
        <span class="ii-checkbox__indicator">{checked ? "v" : indeterminate ? "-" : ""}</span>
      </span>
      {label && <span class="ii-checkbox__label">{label}</span>}
    </label>
  );
}