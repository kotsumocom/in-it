
import { injectCSS } from "../../inject.ts";
import { INPUT_CSS } from "../ui/Input.tsx";

/** @internal CSS for NumberInput — extends Input CSS. */
const NUMBER_INPUT_CSS = `/* --- NumberInput --- */
.ii-number-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.ii-number-input__prefix,
.ii-number-input__suffix {
  position: absolute;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
  pointer-events: none;
  user-select: none;
}
.ii-number-input__prefix {
  left: 12px;
}
.ii-number-input__suffix {
  right: 12px;
}
.ii-number-input__field--has-prefix {
  padding-left: 28px;
}
.ii-number-input__field--has-suffix {
  padding-right: 28px;
}
`;

/** Format a number with thousand separators. */
function formatWithSeparator(n: number): string {
  const parts = String(n).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/** Parse a formatted string back to a number. */
function parseFormatted(str: string): number | null {
  const cleaned = str.replace(/,/g, "").trim();
  if (cleaned === "" || cleaned === "-") return null;
  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
}

/**
 * Props for the {@link NumberInput} component.
 * @property value - Current numeric value (null = empty).
 * @property onChange - Callback with the parsed number (null if empty/invalid).
 * @property prefix - Left adornment (e.g. "¥", "$").
 * @property suffix - Right adornment (e.g. "%", "kg").
 * @property thousandSeparator - Whether to format with thousand separators.
 */
export interface NumberInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  thousandSeparator?: boolean;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  error?: string;
  helper?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  class?: string;
}

/**
 * Numeric input with optional thousand separators and prefix/suffix adornments.
 *
 * Uses `type="text"` + `inputmode="decimal"` internally so that
 * thousand separators (commas) work correctly. The display shows
 * formatted values; editing shows raw numbers.
 *
 * @example
 * ```tsx
 * <NumberInput
 *   label="借方金額"
 *   value={amount}
 *   onChange={setAmount}
 *   prefix="¥"
 *   thousandSeparator
 *   min={0}
 * />
 * ```
 */
export function NumberInput({
  value,
  onChange,
  label,
  placeholder,
  prefix,
  suffix,
  thousandSeparator = false,
  min,
  max,
  step,
  required,
  error,
  helper,
  disabled,
  id,
  name,
  class: cls,
}: NumberInputProps): any {
  // Reuse Input's CSS for consistent styling
  injectCSS("ii-input", INPUT_CSS);
  injectCSS("ii-number-input", NUMBER_INPUT_CSS);

  const displayValue = value != null
    ? (thousandSeparator ? formatWithSeparator(value) : String(value))
    : "";

  const fieldCls = [
    "ii-input__field",
    prefix ? "ii-number-input__field--has-prefix" : "",
    suffix ? "ii-number-input__field--has-suffix" : "",
  ].filter(Boolean).join(" ");

  const handleInput = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value;
    const parsed = parseFormatted(raw);
    if (parsed != null) {
      if (min != null && parsed < min) return;
      if (max != null && parsed > max) return;
    }
    onChange(parsed);
  };

  const handleBlur = (e: Event) => {
    // Re-format on blur by triggering a re-render
    const raw = (e.target as HTMLInputElement).value;
    const parsed = parseFormatted(raw);
    if (parsed != null) {
      let clamped = parsed;
      if (min != null) clamped = Math.max(min, clamped);
      if (max != null) clamped = Math.min(max, clamped);
      onChange(clamped);
    } else {
      onChange(null);
    }
  };

  return (
    <div class={`ii-input${error ? " ii-input--error" : ""}${cls ? ` ${cls}` : ""}`}>
      {label && (
        <label class={`ii-input__label${required ? " ii-input__label--required" : ""}`} for={id}>
          {label}
        </label>
      )}
      <div class="ii-number-input__wrapper">
        {prefix && <span class="ii-number-input__prefix">{prefix}</span>}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          class={fieldCls}
          placeholder={placeholder}
          value={displayValue}
          disabled={disabled}
          required={required}
          step={step}
          style="width:100%"
          onInput={handleInput}
          onBlur={handleBlur}
        />
        {suffix && <span class="ii-number-input__suffix">{suffix}</span>}
      </div>
      {error && <span class="ii-input__error">{error}</span>}
      {!error && helper && <span class="ii-input__helper">{helper}</span>}
    </div>
  );
}
