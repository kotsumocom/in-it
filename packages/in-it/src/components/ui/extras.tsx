/**
 * extras.tsx - Additional UI components
 */

export interface TextareaProps {
  label?: string; placeholder?: string; rows?: number; helper?: string; error?: string;
  value?: string; onInput?: (e: Event) => void;
}
export function Textarea({ label, placeholder, rows = 3, helper, error, value, onInput }: TextareaProps): any {
  return (
    <div class={`ii-input${error ? " ii-input--error" : ""}`}>
      {label && <label class="ii-input__label">{label}</label>}
      <textarea class="ii-input__field" placeholder={placeholder} rows={rows} value={value} onInput={onInput} />
      {error && <span class="ii-input__error">{error}</span>}
      {helper && !error && <span class="ii-input__helper">{helper}</span>}
    </div>
  );
}

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string; icon?: string; closable?: boolean; onClose?: () => void; children: any;
}
export function Alert({ variant = "info", title, icon, closable, onClose, children }: AlertProps): any {
  const icons: Record<string, string> = { info: "i", success: "ok", warning: "!", error: "x" };
  return (
    <div class={`ii-alert ii-alert--${variant}`} role="alert">
      <span class="ii-alert__icon">{icon ?? icons[variant]}</span>
      <div class="ii-alert__body">
        {title && <div class="ii-alert__title">{title}</div>}
        <div class="ii-alert__desc">{children}</div>
      </div>
      {closable && (
        <button class="ii-alert__close" onClick={onClose} aria-label="Close">x</button>
      )}
    </div>
  );
}

export interface ProgressProps { value?: number; max?: number; label?: string; }
export function Progress({ value = 0, max = 100, label }: ProgressProps): any {
  const pct = Math.round((value / max) * 100);
  return (
    <div class="ii-progress" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      {label && <div class="ii-progress__label">{label} {pct}%</div>}
      <div class="ii-progress__track">
        <div class="ii-progress__bar" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export interface ProgressCircularProps { value?: number; size?: number; strokeWidth?: number; }
export function ProgressCircular({ value = 0, size = 48, strokeWidth = 4 }: ProgressCircularProps): any {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg class="ii-progress-circular" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="progressbar" aria-valuenow={value}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ii-surface-container-high)" stroke-width={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ii-primary)" stroke-width={strokeWidth}
        stroke-dasharray={c} stroke-dashoffset={offset} stroke-linecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.3s" }} />
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="var(--ii-on-surface)" font-size="0.75rem">
        {value}%
      </text>
    </svg>
  );
}

export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbProps { items: BreadcrumbItem[]; separator?: string; }
export function Breadcrumb({ items, separator = "/" }: BreadcrumbProps): any {
  return (
    <nav class="ii-breadcrumb" aria-label="Breadcrumb">
      <ol class="ii-breadcrumb__list">
        {items.map((item, i) => (
          <li key={i} class="ii-breadcrumb__item">
            {item.href
              ? <a href={item.href} class="ii-breadcrumb__link">{item.label}</a>
              : <span class="ii-breadcrumb__current" aria-current="page">{item.label}</span>}
            {i < items.length - 1 && <span class="ii-breadcrumb__sep" aria-hidden="true">{separator}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface DividerProps { label?: string; }
export function Divider({ label }: DividerProps): any {
  if (label) {
    return <div class="ii-divider ii-divider--label"><span>{label}</span></div>;
  }
  return <hr class="ii-divider" />;
}

export interface KbdProps { children: any; }
export function Kbd({ children }: KbdProps): any {
  return <kbd class="ii-kbd">{children}</kbd>;
}
