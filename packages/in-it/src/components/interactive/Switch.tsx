/**
 * Switch component
 * WAI-ARIA Switch pattern
 */
import { useState } from "hono/jsx";

export interface SwitchProps {
  defaultChecked?: boolean;
  label?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({ defaultChecked = false, label, disabled, onChange }: SwitchProps): any {
  const [checked, setChecked] = useState(defaultChecked);

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <label class={`ii-switch${disabled ? " ii-switch--disabled" : ""}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        class={`ii-switch__track${checked ? " ii-switch__track--on" : ""}`}
        disabled={disabled}
        onClick={toggle}
      >
        <span class="ii-switch__thumb" />
      </button>
      {label && <span class="ii-switch__label">{label}</span>}
    </label>
  );
}
