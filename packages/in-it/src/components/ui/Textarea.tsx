
/** @internal CSS for Textarea — co-located for self-containment. */
export const TEXTAREA_CSS = `/* --- Textarea --- */
.ii-textarea { display: flex; flex-direction: column; gap: var(--ii-spacing-1); }
.ii-textarea__label { font-size: var(--ii-font-sm); font-weight: 500; color: var(--ii-on-surface-variant); }
.ii-textarea__field {
  padding: 10px 12px; background: var(--ii-surface); border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md); font-family: inherit; font-size: var(--ii-font-base);
  color: var(--ii-on-surface); min-height: 100px; resize: vertical; transition: border-color var(--ii-transition);
}
.ii-textarea__field:hover { border-color: var(--ii-outline); }
.ii-textarea__field:focus { outline: 2px solid var(--ii-primary); outline-offset: 2px; border-color: var(--ii-primary); }
.ii-textarea__field::placeholder { color: var(--ii-on-surface-variant); }
.ii-textarea__count { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); text-align: right; }
`;

/** Props for the Textarea component. */
export interface TextareaProps {
  label?: string;
  placeholder?: string;
  rows?: number;
  helper?: string;
  error?: string;
  value?: string;
  onInput?: (e: Event) => void;
}

/** Multi-line text input with label and validation support. */
export function Textarea({ label, placeholder, rows = 3, helper, error, value, onInput }: TextareaProps): any {
  return (
    <div class={`ii-textarea${error ? " ii-input--error" : ""}`}>
      {label && <label class="ii-textarea__label">{label}</label>}
      <textarea class="ii-textarea__field" placeholder={placeholder} rows={rows} value={value} onInput={onInput} />
      {error && <span class="ii-input__error">{error}</span>}
      {helper && !error && <span class="ii-input__helper">{helper}</span>}
    </div>
  );
}
