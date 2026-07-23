/**
 * FormField — Generic form field wrapper with label, helper, and error.
 *
 * Wraps any input element (Select, Combobox, Checkbox, etc.) with
 * consistent label, helper text, and error message styling.
 * For simple text inputs, prefer the {@link Input} component which
 * includes its own label/error handling.
 *
 * @example
 * ```tsx
 * <FormField label="Status" error={errors.status} required>
 *   <Select options={statusOptions} value={status} onChange={setStatus} />
 * </FormField>
 *
 * <FormField label="Priority" helper="Select the task priority.">
 *   <Combobox items={priorities} value={priority} onChange={setPriority} />
 * </FormField>
 * ```
 */
import { injectCSS } from "../../inject.ts";

/** @internal CSS for FormField — co-located for self-containment. */
export const FORM_FIELD_CSS = `/* --- FormField --- */
.ii-form-field {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
}
.ii-form-field__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
.ii-form-field__label--required::after {
  content: ' *';
  color: var(--ii-error);
}
.ii-form-field__content {
  display: flex;
  flex-direction: column;
}
.ii-form-field__helper {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin-top: var(--ii-spacing-1);
}
.ii-form-field__error {
  font-size: var(--ii-font-sm);
  color: var(--ii-error);
  margin-top: var(--ii-spacing-1);
}

/* Horizontal layout variant */
.ii-form-field--horizontal {
  flex-direction: row;
  align-items: center;
  gap: var(--ii-spacing-3);
}
.ii-form-field--horizontal .ii-form-field__label {
  min-width: 120px;
  flex-shrink: 0;
}
.ii-form-field--horizontal .ii-form-field__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}
`;

/** Props for the {@link FormField} component. */
export interface FormFieldProps {
  /** Label text for the field. */
  label: string;
  /** HTML id for the label's `for` attribute. Should match the input's `id`. */
  id?: string;
  /** Whether the field is required. Adds a red asterisk to the label. */
  required?: boolean;
  /** Hint text shown below the field (hidden when error is set). */
  helper?: string;
  /** Error message shown below the field, overrides helper. */
  error?: string;
  /** Layout direction: vertical (default) or horizontal. */
  layout?: "vertical" | "horizontal";
  /** The input element(s) to wrap. */
  children: any;
  /** Additional CSS class. */
  class?: string;
}

/**
 * Generic form field wrapper providing label, helper, and error messaging.
 *
 * Use this to wrap any input-like component (Select, Combobox, etc.)
 * with consistent form field chrome. The error prop takes priority
 * over helper — when both are set, only the error is shown.
 */
export function FormField({
  label,
  id,
  required,
  helper,
  error,
  layout = "vertical",
  children,
  class: cls,
}: FormFieldProps): any {
  injectCSS("ii-form-field", FORM_FIELD_CSS);

  const rootCls = [
    "ii-form-field",
    layout === "horizontal" ? "ii-form-field--horizontal" : "",
    cls ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const labelEl = (
    <label
      class={`ii-form-field__label${required ? " ii-form-field__label--required" : ""}`}
      for={id}
    >
      {label}
    </label>
  );

  const messageEl = error ? (
    <span class="ii-form-field__error" role="alert">
      {error}
    </span>
  ) : helper ? (
    <span class="ii-form-field__helper">{helper}</span>
  ) : null;

  if (layout === "horizontal") {
    return (
      <div class={rootCls}>
        {labelEl}
        <div class="ii-form-field__body">
          <div class="ii-form-field__content">{children}</div>
          {messageEl}
        </div>
      </div>
    );
  }

  return (
    <div class={rootCls}>
      {labelEl}
      <div class="ii-form-field__content">{children}</div>
      {messageEl}
    </div>
  );
}
