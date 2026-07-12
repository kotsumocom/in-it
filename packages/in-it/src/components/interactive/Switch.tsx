/**
 * Switch コンポーネント（hono/jsx/dom）
 * WAI-ARIA Switch パターン準拠
 */
import { useState, useCallback } from "hono/jsx";
import { createSwitch } from "../../aria/switch.ts";

export interface SwitchProps {
  /** 初期値 */
  checked?: boolean;
  /** 無効状態 */
  disabled?: boolean;
  /** ラベル */
  label?: string;
  /** 説明文 */
  description?: string;
  /** 変更時コールバック */
  onChange?: (checked: boolean) => void;
}

export function Switch({
  checked: initialChecked = false,
  disabled = false,
  label,
  description,
  onChange,
}: SwitchProps) {
  const [checked, setChecked] = useState(initialChecked);

  const handleChange = useCallback(
    (val: boolean) => {
      setChecked(val);
      onChange?.(val);
    },
    [onChange],
  );

  const api = createSwitch({
    checked,
    disabled,
    onChange: handleChange,
  });

  return (
    <div class="sc-switch">
      {label && (
        <div class="sc-switch__info">
          <label class="sc-switch__label" {...api.labelProps}>
            {label}
          </label>
          {description && (
            <span class="sc-switch__desc">{description}</span>
          )}
        </div>
      )}
      <button
        type="button"
        class={`sc-switch__track${checked ? " sc-switch__track--checked" : ""}${disabled ? " sc-switch__track--disabled" : ""}`}
        {...api.rootProps}
      >
        <span class="sc-switch__thumb" />
      </button>
    </div>
  );
}
