/**
 * WAI-ARIA Switch pattern
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 *
 * Framework-agnostic. Manages ARIA attributes and keyboard interactions in pure TypeScript.
 */

/** SwitchState interface */
export interface SwitchState {
  checked: boolean;
  disabled: boolean;
}

/** SwitchRootProps interface */
export interface SwitchRootProps {
  role: "switch";
  "aria-checked": boolean;
  "aria-disabled": boolean | undefined;
  "aria-labelledby": string;
  tabIndex: number;
  onKeyDown: (e: KeyboardEvent) => void;
  onClick: () => void;
}

/** SwitchApi interface */
export interface SwitchApi {
  /** Props to apply to the Switch root element */
  rootProps: SwitchRootProps;
  /** Props to apply to the label element */
  labelProps: { id: string };
  /** Current checked state */
  checked: boolean;
  /** Toggle the state */
  toggle: () => void;
  /** Set the state directly */
  setChecked: (checked: boolean) => void;
}

/** CreateSwitchOptions interface */
export interface CreateSwitchOptions {
  /** Initial value */
  checked?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Change callback */
  onChange?: (checked: boolean) => void;
  /** ID (auto-generated if omitted) */
  id?: string;
}

let counter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++counter}`;
}

/**
 * Create a WAI-ARIA Switch pattern.
 *
 * @example
 * ```ts
 * const sw = createSwitch({ checked: false, onChange: console.log });
 * // Apply sw.rootProps to <button> and sw.labelProps to <label>
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