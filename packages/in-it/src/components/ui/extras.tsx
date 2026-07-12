/** Textarea */
export interface TextareaProps {
  label?: string; placeholder?: string; value?: string; maxLength?: number;
  disabled?: boolean; onInput?: (e: Event) => void;
}
export function Textarea({ label, placeholder, value, maxLength, disabled, onInput }: TextareaProps) {
  return (
    <div class="ii-textarea">
      {label && <label class="ii-textarea__label">{label}</label>}
      <textarea class="ii-textarea__field" placeholder={placeholder} value={value}
        maxLength={maxLength} disabled={disabled} onInput={onInput} />
      {maxLength && <span class="ii-textarea__count">{(value?.length ?? 0)} / {maxLength}</span>}
    </div>
  );
}

/** Alert */
export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string; icon?: string; closable?: boolean; onClose?: () => void; children: any;
}
export function Alert({ variant = "info", title, icon, closable, onClose, children }: AlertProps) {
  const icons: Record<string, string> = { info: "邃ｹ・・, success: "笨・, warning: "笞・・, error: "笶・ };
  return (
    <div class={`ii-alert ii-alert--${variant}`} role="alert">
      <span class="ii-alert__icon">{icon ?? icons[variant]}</span>
      <div class="ii-alert__body">
        {title && <div class="ii-alert__title">{title}</div>}
        <div class="ii-alert__desc">{children}</div>
      </div>
      {closable && <button type="button" class="ii-alert__close" aria-label="髢峨§繧・ onClick={onClose}>笨・/button>}
    </div>
  );
}

/** Progress Bar */
export interface ProgressProps {
  value?: number; max?: number; label?: string; indeterminate?: boolean;
}
export function Progress({ value = 0, max = 100, label, indeterminate }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div class="ii-progress" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      {label && <div class="ii-progress__label"><span>{label}</span><span>{Math.round(pct)}%</span></div>}
      <div class="ii-progress__track">
        <div class={`ii-progress__fill${indeterminate ? " ii-progress__fill--indeterminate" : ""}`}
          style={indeterminate ? {} : { width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Progress Circular */
export interface ProgressCircularProps {
  value?: number; size?: number; strokeWidth?: number; showLabel?: boolean;
}
export function ProgressCircular({ value = 0, size = 48, strokeWidth = 4, showLabel }: ProgressCircularProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div class="ii-progress-circular" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg class="ii-progress-circular__svg" width={size} height={size}>
        <circle class="ii-progress-circular__track" cx={size/2} cy={size/2} r={r} stroke-width={strokeWidth} />
        <circle class="ii-progress-circular__fill" cx={size/2} cy={size/2} r={r} stroke-width={strokeWidth}
          stroke-dasharray={circumference} stroke-dashoffset={offset} />
      </svg>
      {showLabel && <span class="ii-progress-circular__label">{Math.round(value)}%</span>}
    </div>
  );
}

/** Breadcrumb */
export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbProps { items: BreadcrumbItem[]; separator?: string; }
export function Breadcrumb({ items, separator = "窶ｺ" }: BreadcrumbProps) {
  return (
    <nav class="ii-breadcrumb" aria-label="繝代Φ縺上★繝ｪ繧ｹ繝・>
      {items.map((item, i) => (
        <>
          {i > 0 && <span class="ii-breadcrumb__sep">{separator}</span>}
          {item.href && i < items.length - 1
            ? <a href={item.href} class="ii-breadcrumb__item">{item.label}</a>
            : <span class={`ii-breadcrumb__item${i === items.length - 1 ? " ii-breadcrumb__item--current" : ""}`}>{item.label}</span>}
        </>
      ))}
    </nav>
  );
}

/** Divider */
export interface DividerProps { vertical?: boolean; }
export function Divider({ vertical }: DividerProps) {
  return <hr class={`ii-divider${vertical ? " ii-divider--vertical" : ""}`} />;
}

/** Kbd */
export interface KbdProps { children: any; }
export function Kbd({ children }: KbdProps) { return <kbd class="ii-kbd">{children}</kbd>; }

