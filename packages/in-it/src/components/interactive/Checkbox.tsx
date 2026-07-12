/**
 * Checkbox 繧ｳ繝ｳ繝昴・繝阪Φ繝・ */
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
    <label class={`ii-checkbox${disabled ? " ii-checkbox--disabled" : ""}`}>
      <input type="checkbox" class="ii-checkbox__input" checked={checked} disabled={disabled} onChange={toggle} />
      <span class={`ii-checkbox__control${checked ? " ii-checkbox__control--checked" : ""}${indeterminate ? " ii-checkbox__control--indeterminate" : ""}`}>
        <span class="ii-checkbox__indicator">{checked ? "笨・ : indeterminate ? "竏・ : ""}</span>
      </span>
      {label && <span class="ii-checkbox__label">{label}</span>}
    </label>
  );
}

