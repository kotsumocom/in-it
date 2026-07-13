/** Badge */
export interface BadgeProps {
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  children: any;
}

export function Badge({ variant = "neutral", children }: BadgeProps): any {
  return (
    <span class={`ii-badge ii-badge--${variant}`}>
      {children}
    </span>
  );
}

/** Card */
export interface CardProps {
  outlined?: boolean;
  children: any;
  class?: string;
}

export function Card({ outlined = false, children, class: cls }: CardProps): any {
  return (
    <div class={`ii-card${outlined ? " ii-card--outlined" : ""}${cls ? ` ${cls}` : ""}`}>
      {children}
    </div>
  );
}

/** Button */
export interface ButtonProps {
  variant?: "filled" | "outlined" | "text";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: any;
  class?: string;
}

export function Button({
  variant = "filled",
  size = "md",
  disabled = false,
  type = "button",
  onClick,
  children,
  class: cls,
}: ButtonProps): any {
  return (
    <button
      type={type}
      class={`ii-btn ii-btn--${variant} ii-btn--${size}${cls ? ` ${cls}` : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/** StatCard */
export interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ label, value, trend, trendUp }: StatCardProps): any {
  return (
    <div class="ii-stat-card">
      <div class="ii-stat-card__label">{label}</div>
      <div class="ii-stat-card__value">{value}</div>
      {trend && (
        <div class={`ii-stat-card__trend${trendUp ? " ii-stat-card__trend--up" : " ii-stat-card__trend--down"}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

/** DataTable */
export interface DataTableColumn<T> {
  key: keyof T & string;
  header?: string;
  label?: string;
  render?: (value: any, row: T) => any;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey?: (row: T) => string;
}

export function DataTable<T>({ columns, data, rowKey }: DataTableProps<T>): any {
  const getKey = rowKey ?? ((_row: T, i: number) => String(i));
  return (
    <div class="ii-data-table-wrap">
      <table class="ii-data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} class={col.align ? `ii-data-table__th--${col.align}` : ""}>
                {col.header ?? col.label ?? col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={getKey(row, i)}>
              {columns.map((col) => (
                <td key={col.key} class={col.align ? `ii-data-table__td--${col.align}` : ""}>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Input */
export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  onInput?: (e: Event) => void;
}

export function Input({ label, placeholder, value, type = "text", helper, error, disabled, onInput }: InputProps): any {
  return (
    <div class="ii-input">
      {label && <label class="ii-input__label">{label}</label>}
      <input
        type={type}
        class="ii-input__field"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onInput={onInput}
      />
      {error && <span class="ii-input__error">{error}</span>}
      {!error && helper && <span class="ii-input__helper">{helper}</span>}
    </div>
  );
}

/** Avatar */
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, src, size = "md" }: AvatarProps): any {
  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  return (
    <div class={`ii-avatar ii-avatar--${size}`}>
      {src ? <img src={src} alt={name ?? ""} /> : initials}
    </div>
  );
}

/** Chip */
export interface ChipProps {
  variant?: "default" | "primary" | "success" | "error";
  onClose?: () => void;
  children: any;
}

export function Chip({ variant = "default", onClose, children }: ChipProps): any {
  return (
    <span class={`ii-chip${variant !== "default" ? ` ii-chip--${variant}` : ""}`}>
      {children}
      {onClose && (
        <button type="button" class="ii-chip__close" aria-label="Remove" onClick={onClose}>
          x
        </button>
      )}
    </span>
  );
}

/** Skeleton */
export interface SkeletonProps {
  width?: string;
  height?: string;
  circle?: boolean;
}

export function Skeleton({ width = "100%", height = "1em", circle = false }: SkeletonProps): any {
  return (
    <div
      class={`ii-skeleton${circle ? " ii-skeleton--circle" : " ii-skeleton--text"}`}
      style={{ width, height }}
    />
  );
}

/** EmptyState */
export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: any;
}

export function EmptyState({ icon = "", title, description, children }: EmptyStateProps): any {
  return (
    <div class="ii-empty">
      <div class="ii-empty__icon">{icon}</div>
      <h3 class="ii-empty__title">{title}</h3>
      {description && <p class="ii-empty__desc">{description}</p>}
      {children}
    </div>
  );
}
