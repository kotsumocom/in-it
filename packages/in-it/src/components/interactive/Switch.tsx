/**
 * Switch component
 * WAI-ARIA Switch pattern
 */
import { useState } from "hono/jsx";

/** @internal CSS for Switch — co-located for self-containment. */
export const SWITCH_CSS = `/* --- Switch --- */
.ii-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ii-spacing-4);
  padding: 14px 0;
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-switch__info { flex: 1; min-width: 0; }
.ii-switch__label {
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface);
  cursor: pointer;
}
.ii-switch__desc {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin-top: 2px;
}
.ii-switch__track {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: var(--ii-outline);
  position: relative;
  cursor: pointer;
  transition: background var(--ii-transition);
  border: none;
  padding: 0;
  flex-shrink: 0;
}
.ii-switch__track:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
}
.ii-switch__track--checked { background: var(--ii-primary); }
.ii-switch__track--disabled { opacity: 0.38; cursor: not-allowed; }
.ii-switch__thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  transition: transform var(--ii-transition);
  box-shadow: var(--ii-shadow-sm);
}
.ii-switch__track--checked .ii-switch__thumb {
  transform: translateX(20px);
}
`;

/** Props for the Switch component. */
export interface SwitchProps {
  defaultChecked?: boolean;
  label?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

/** Toggle switch for boolean on/off states with ARIA switch pattern. */
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
        class={`ii-switch__track${checked ? " ii-switch__track--checked" : ""}`}
        disabled={disabled}
        onClick={toggle}
      >
        <span class="ii-switch__thumb" />
      </button>
      {label && <span class="ii-switch__label">{label}</span>}
    </label>
  );
}