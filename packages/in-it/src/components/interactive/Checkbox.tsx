/**
 * Checkbox コンポーネント
 */
import { useState, useCallback } from "hono/jsx";

export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ checked: controlledChecked, indeterminate, disabled, label, onChange }: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(controlledChecked ?? false);
  const checked = controlledChecked ?? internalChecked;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    setInternalChecked(next);
    onChange?.(next);
  }, [checked, disabled, onChange]);

  return (
    <label class={`sc-checkbox${disabled ? " sc-checkbox--disabled" : ""}`}>
      <input type="checkbox" class="sc-checkbox__input" checked={checked} disabled={disabled} onChange={toggle} />
      <span class={`sc-checkbox__control${checked ? " sc-checkbox__control--checked" : ""}${indeterminate ? " sc-checkbox__control--indeterminate" : ""}`}>
        <span class="sc-checkbox__indicator">{checked ? "✓" : indeterminate ? "−" : ""}</span>
      </span>
      {label && <span class="sc-checkbox__label">{label}</span>}
    </label>
  );
}
