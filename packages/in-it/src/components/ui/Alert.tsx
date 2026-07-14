import { Icon } from "../../icons/Icon.tsx";
import { t } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Alert — co-located for self-containment. */
export const ALERT_CSS = `/* --- Alert --- */
.ii-alert {
  display: flex; gap: 12px; padding: 16px; border-radius: var(--ii-shape-md);
  border: 1px solid var(--ii-outline-variant); background: var(--ii-surface);
}
.ii-alert--info { border-color: var(--ii-info); background: color-mix(in srgb, var(--ii-info) 8%, var(--ii-surface)); }
.ii-alert--success { border-color: var(--ii-success); background: color-mix(in srgb, var(--ii-success) 8%, var(--ii-surface)); }
.ii-alert--warning { border-color: var(--ii-warning); background: color-mix(in srgb, var(--ii-warning) 8%, var(--ii-surface)); }
.ii-alert--error { border-color: var(--ii-error); background: color-mix(in srgb, var(--ii-error) 8%, var(--ii-surface)); }
.ii-alert__icon { font-size: 1.25rem; flex-shrink: 0; }
.ii-alert__body { flex: 1; }
.ii-alert__title { font-weight: 600; margin-bottom: 4px; }
.ii-alert__desc { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-alert__close { background: none; border: none; cursor: pointer; color: var(--ii-on-surface-variant); font-size: 1rem; padding: 0; }
`;

/** Props for the Alert component. */
export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  icon?: any;
  closable?: boolean;
  onClose?: () => void;
  children: any;
}

/** Inline alert banner with icon, title, and dismissible option. */
export function Alert({ variant = "info", title, icon, closable, onClose, children }: AlertProps): any {
  injectCSS("ii-alert", ALERT_CSS);
  const defaultIcons: Record<string, any> = {
    info: <Icon name="info-circle" size={18} />,
    success: <Icon name="circle-check" size={18} />,
    warning: <Icon name="alert-triangle" size={18} />,
    error: <Icon name="circle-x" size={18} />,
  };
  return (
    <div class={`ii-alert ii-alert--${variant}`} role="alert">
      <span class="ii-alert__icon">{icon ?? defaultIcons[variant]}</span>
      <div class="ii-alert__body">
        {title && <div class="ii-alert__title">{title}</div>}
        <div class="ii-alert__desc">{children}</div>
      </div>
      {closable && (
        <button class="ii-alert__close" onClick={onClose} aria-label={t("close")}><Icon name="x" size={16} /></button>
      )}
    </div>
  );
}
