/**
 * Checkbox component
 */
import { useState } from "hono/jsx";
import { CHECKBOX_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";

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
  injectCSS("ii-checkbox", CHECKBOX_CSS);
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