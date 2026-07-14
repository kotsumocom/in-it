/**
 * Switch component
 * WAI-ARIA Switch pattern
 */
import { useState } from "hono/jsx";
import { SWITCH_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";

/** Props for the Switch component. */
export interface SwitchProps {
  defaultChecked?: boolean;
  label?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

/** Toggle switch for boolean on/off states with ARIA switch pattern. */
export function Switch({ defaultChecked = false, label, disabled, onChange }: SwitchProps): any {
  injectCSS("ii-switch", SWITCH_CSS);
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