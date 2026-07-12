/**
 * WAI-ARIA Switch パターン
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 *
 * フレームワーク非依存。純粋な TypeScript で ARIA 属性とキーボード操作を管理。
 */

export interface SwitchState {
  checked: boolean;
  disabled: boolean;
}

export interface SwitchRootProps {
  role: "switch";
  "aria-checked": boolean;
  "aria-disabled": boolean | undefined;
  "aria-labelledby": string;
  tabIndex: number;
  onKeyDown: (e: KeyboardEvent) => void;
  onClick: () => void;
}

export interface SwitchApi {
  /** Switch ルート要素に適用する props */
  rootProps: SwitchRootProps;
  /** ラベル要素に適用する props */
  labelProps: { id: string };
  /** 現在の checked 状態 */
  checked: boolean;
  /** 状態をトグルする */
  toggle: () => void;
  /** 状態を直接設定する */
  setChecked: (checked: boolean) => void;
}

export interface CreateSwitchOptions {
  /** 初期値 */
  checked?: boolean;
  /** 無効状態 */
  disabled?: boolean;
  /** 変更時コールバック */
  onChange?: (checked: boolean) => void;
  /** ID（省略時は自動生成） */
  id?: string;
}

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

/**
 * WAI-ARIA Switch パターンを作成する。
 *
 * @example
 * ```ts
 * const sw = createSwitch({ checked: false, onChange: console.log });
 * // sw.rootProps を <button> に、sw.labelProps を <label> に適用
 * ```
 */
export function createSwitch(options: CreateSwitchOptions = {}): SwitchApi {
  const labelId = options.id ?? uid("switch-label");
  let checked = options.checked ?? false;
  const disabled = options.disabled ?? false;

  function toggle() {
    if (disabled) return;
    checked = !checked;
    options.onChange?.(checked);
  }

  function setChecked(value: boolean) {
    if (disabled) return;
    checked = value;
    options.onChange?.(checked);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  }

  return {
    rootProps: {
      role: "switch" as const,
      "aria-checked": checked,
      "aria-disabled": disabled || undefined,
      "aria-labelledby": labelId,
      tabIndex: disabled ? -1 : 0,
      onKeyDown: handleKeyDown,
      onClick: toggle,
    },
    labelProps: {
      id: labelId,
    },
    checked,
    toggle,
    setChecked,
  };
}
