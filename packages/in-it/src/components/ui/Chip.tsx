import { injectCSS } from "../../inject.ts";
import { t } from "../../locale.ts";

/** @internal CSS for Chip — co-located for self-containment. */
export const CHIP_CSS = `/* --- Chip / Tag --- */
.ii-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: var(--ii-font-sm);
  font-weight: 500;
  border: 1px solid var(--ii-outline-variant);
  background: var(--ii-surface);
  color: var(--ii-on-surface);
  cursor: default;
}
.ii-chip--primary { background: var(--ii-primary-container); color: var(--ii-primary); border-color: transparent; }
.ii-chip--success { background: color-mix(in srgb, var(--ii-success) 12%, var(--ii-surface)); color: var(--ii-success); border-color: transparent; }
.ii-chip--error { background: color-mix(in srgb, var(--ii-error) 12%, var(--ii-surface)); color: var(--ii-error); border-color: transparent; }
.ii-chip__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: inherit;
  padding: 0;
  margin-left: 2px;
}
`;

/** Props for the {@link Chip} component.
 * @property variant - Color variant: default, primary, success, or error.
 * @property size - Size variant: sm or md (default).
 * @property onClose - When provided, renders a close button that calls this handler.
 */
export interface ChipProps {
  variant?: "default" | "primary" | "success" | "error";
  size?: "sm" | "md";
  onClose?: () => void;
  children: any;
}

/** Compact label element for tags, filters, or selections. Supports an optional dismiss button. */
export function Chip({ variant = "default", size = "md", onClose, children }: ChipProps): any {
  injectCSS("ii-chip", CHIP_CSS);
  const mods = `ii-chip${variant !== "default" ? ` ii-chip--${variant}` : ""}${size !== "md" ? ` ii-chip--${size}` : ""}`;
  return (
    <span class={mods}>
      {children}
      {onClose && (
        <button type="button" class="ii-chip__close" aria-label={t("remove")} onClick={onClose}>
          x
        </button>
      )}
    </span>
  );
}
