/** Textarea */
export interface TextareaProps {
  label?: string; placeholder?: string; value?: string; maxLength?: number;
  disabled?: boolean; onInput?: (e: Event) => void;
}
export function Textarea({ label, placeholder, value, maxLength, disabled, onInput }: TextareaProps) {
  return (
    <div class="sc-textarea">
      {label && <label class="sc-textarea__label">{label}</label>}
      <textarea class="sc-textarea__field" placeholder={placeholder} value={value}
        maxLength={maxLength} disabled={disabled} onInput={onInput} />
      {maxLength && <span class="sc-textarea__count">{(value?.length ?? 0)} / {maxLength}</span>}
    </div>
  );
}

/** Alert */
export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title?: string; icon?: string; closable?: boolean; onClose?: () => void; children: any;
}
export function Alert({ variant = "info", title, icon, closable, onClose, children }: AlertProps) {
  const icons: Record<string, string> = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };
  return (
    <div class={`sc-alert sc-alert--${variant}`} role="alert">
      <span class="sc-alert__icon">{icon ?? icons[variant]}</span>
      <div class="sc-alert__body">
        {title && <div class="sc-alert__title">{title}</div>}
        <div class="sc-alert__desc">{children}</div>
      </div>
      {closable && <button type="button" class="sc-alert__close" aria-label="閉じる" onClick={onClose}>✕</button>}
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
    <div class="sc-progress" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      {label && <div class="sc-progress__label"><span>{label}</span><span>{Math.round(pct)}%</span></div>}
      <div class="sc-progress__track">
        <div class={`sc-progress__fill${indeterminate ? " sc-progress__fill--indeterminate" : ""}`}
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
    <div class="sc-progress-circular" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg class="sc-progress-circular__svg" width={size} height={size}>
        <circle class="sc-progress-circular__track" cx={size/2} cy={size/2} r={r} stroke-width={strokeWidth} />
        <circle class="sc-progress-circular__fill" cx={size/2} cy={size/2} r={r} stroke-width={strokeWidth}
          stroke-dasharray={circumference} stroke-dashoffset={offset} />
      </svg>
      {showLabel && <span class="sc-progress-circular__label">{Math.round(value)}%</span>}
    </div>
  );
}

/** Breadcrumb */
export interface BreadcrumbItem { label: string; href?: string; }
export interface BreadcrumbProps { items: BreadcrumbItem[]; separator?: string; }
export function Breadcrumb({ items, separator = "›" }: BreadcrumbProps) {
  return (
    <nav class="sc-breadcrumb" aria-label="パンくずリスト">
      {items.map((item, i) => (
        <>
          {i > 0 && <span class="sc-breadcrumb__sep">{separator}</span>}
          {item.href && i < items.length - 1
            ? <a href={item.href} class="sc-breadcrumb__item">{item.label}</a>
            : <span class={`sc-breadcrumb__item${i === items.length - 1 ? " sc-breadcrumb__item--current" : ""}`}>{item.label}</span>}
        </>
      ))}
    </nav>
  );
}

/** Divider */
export interface DividerProps { vertical?: boolean; }
export function Divider({ vertical }: DividerProps) {
  return <hr class={`sc-divider${vertical ? " sc-divider--vertical" : ""}`} />;
}

/** Kbd */
export interface KbdProps { children: any; }
export function Kbd({ children }: KbdProps) { return <kbd class="sc-kbd">{children}</kbd>; }
