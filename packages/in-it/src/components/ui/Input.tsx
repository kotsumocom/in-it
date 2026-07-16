
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Input — co-located for self-containment. */
export const INPUT_CSS = `/* --- Input / TextField --- */
.ii-input {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
}
.ii-input__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
.ii-input__label--required::after {
  content: ' *';
  color: var(--ii-error);
}
.ii-input__field {
  min-height: 40px;
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  transition: border-color var(--ii-transition);
}
.ii-input__field:hover { border-color: var(--ii-outline); }
.ii-input__field:focus {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
  border-color: var(--ii-primary);
}
.ii-input__field::placeholder { color: var(--ii-on-surface-variant); }
.ii-input__helper {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-input__error {
  font-size: var(--ii-font-sm);
  color: var(--ii-error);
}

/* --- Input Validation States --- */
.ii-input--error .ii-input__field,
.ii-input__field[aria-invalid="true"] {
  border-color: var(--ii-error);
}
.ii-input--error .ii-input__field:focus,
.ii-input__field[aria-invalid="true"]:focus {
  outline-color: var(--ii-error);
}
.ii-input--success .ii-input__field {
  border-color: var(--ii-success);
}
.ii-input--success .ii-input__field:focus {
  outline-color: var(--ii-success);
}
/* Also support bare input elements using ii-input class */
input.ii-input, select.ii-input, textarea.ii-input {
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  transition: border-color var(--ii-transition);
  width: 100%;
  box-sizing: border-box;
}
input.ii-input:hover, select.ii-input:hover, textarea.ii-input:hover {
  border-color: var(--ii-outline);
}
input.ii-input:focus, select.ii-input:focus, textarea.ii-input:focus {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
  border-color: var(--ii-primary);
}
input.ii-input::placeholder, textarea.ii-input::placeholder {
  color: var(--ii-on-surface-variant);
}
.ii-input-field {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
}
.ii-input-field__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
`;

/** Props for the {@link Input} component.
 * @property label - Label text above the input field.
 * @property helper - Hint text shown below the field (hidden when error is set).
 * @property error - Error message shown below the field, overrides helper.
 */
export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  onInput?: (e: Event) => void;
  /** HTML id attribute for the input element. */
  id?: string;
  /** HTML name attribute for form submission. */
  name?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Autocomplete hint. */
  autocomplete?: string;
  /** Minimum input length. */
  minLength?: number;
  /** Additional CSS class. */
  class?: string;
}

/** Text input field with optional label, helper text, and error state. Error takes priority over helper. */
export function Input({ label, placeholder, value, type = "text", helper, error, disabled, onInput, id, name, required, autocomplete, minLength, class: cls }: InputProps): any {
  injectCSS("ii-input", INPUT_CSS);
  return (
    <div class={`ii-input${error ? " ii-input--error" : ""}${cls ? ` ${cls}` : ""}`}>
      {label && <label class={`ii-input__label${required ? " ii-input__label--required" : ""}`} for={id}>{label}</label>}
      <input
        id={id}
        name={name}
        type={type}
        class="ii-input__field"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        required={required}
        autocomplete={autocomplete}
        minLength={minLength}
        onInput={onInput}
      />
      {error && <span class="ii-input__error">{error}</span>}
      {!error && helper && <span class="ii-input__helper">{helper}</span>}
    </div>
  );
}
