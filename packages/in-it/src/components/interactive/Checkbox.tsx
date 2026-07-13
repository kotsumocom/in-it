/**
 * Checkbox component
 */
import { useState } from "hono/jsx";

export interface CheckboxProps {
  label?: string;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

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
