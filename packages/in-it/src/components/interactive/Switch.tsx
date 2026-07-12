/**
 * Switch コンポ�Eネント！Eono/jsx/dom�E�E * WAI-ARIA Switch パターン準拠
 */
import { useState, useCallback } from "hono/jsx";
import { createSwitch } from "../../aria/switch.ts";

export interface SwitchProps {
  /** 初期値 */
  checked?: boolean;
  /** 無効状慁E*/
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
    <div class="ii-switch">
      {label && (
        <div class="ii-switch__info">
          <label class="ii-switch__label" {...api.labelProps}>
            {label}
          </label>
          {description && (
            <span class="ii-switch__desc">{description}</span>
          )}
        </div>
      )}
      <button
        type="button"
        class={`ii-switch__track${checked ? " ii-switch__track--checked" : ""}${disabled ? " ii-switch__track--disabled" : ""}`}
        {...api.rootProps}
      >
        <span class="ii-switch__thumb" />
      </button>
    </div>
  );
}

