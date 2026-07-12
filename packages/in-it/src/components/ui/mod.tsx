/** ステータスバッジ */
export interface BadgeProps {
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  children: any;
}

export function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span class={`sc-badge sc-badge--${variant}`}>
      {children}
    </span>
  );
}

/** カード */
export interface CardProps {
  outlined?: boolean;
  children: any;
  class?: string;
}

export function Card({ outlined = false, children, class: cls }: CardProps) {
  return (
    <div class={`sc-card${outlined ? " sc-card--outlined" : ""}${cls ? ` ${cls}` : ""}`}>
      {children}
    </div>
  );
}

/** ボタン */
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
}: ButtonProps) {
  return (
    <button
      type={type}
      class={`sc-btn sc-btn--${variant} sc-btn--${size}${cls ? ` ${cls}` : ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/** 統計カード */
export interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ label, value, trend, trendUp }: StatCardProps) {
  return (
    <div class="sc-stat-card">
      <div class="sc-stat-card__label">{label}</div>
      <div class="sc-stat-card__value">{value}</div>
      {trend && (
        <div class={`sc-stat-card__trend${trendUp ? " sc-stat-card__trend--up" : " sc-stat-card__trend--down"}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

/** データテーブル */
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

export function DataTable<T>({ columns, data, rowKey }: DataTableProps<T>) {
  const getKey = rowKey ?? ((_row: T, i: number) => String(i));
  return (
    <div class="sc-data-table-wrap">
      <table class="sc-data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} class={col.align ? `sc-data-table__th--${col.align}` : ""}>
                {col.header ?? col.label ?? col.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={getKey(row, i)}>
              {columns.map((col) => (
                <td key={col.key} class={col.align ? `sc-data-table__td--${col.align}` : ""}>
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

/** テキストフィールド */
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

export function Input({ label, placeholder, value, type = "text", helper, error, disabled, onInput }: InputProps) {
  return (
    <div class="sc-input">
      {label && <label class="sc-input__label">{label}</label>}
      <input
        type={type}
        class="sc-input__field"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onInput={onInput}
      />
      {error && <span class="sc-input__error">{error}</span>}
      {!error && helper && <span class="sc-input__helper">{helper}</span>}
    </div>
  );
}

/** アバター */
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  return (
    <div class={`sc-avatar sc-avatar--${size}`}>
      {src ? <img src={src} alt={name ?? ""} /> : initials}
    </div>
  );
}

/** チップ / タグ */
export interface ChipProps {
  variant?: "default" | "primary" | "success" | "error";
  onClose?: () => void;
  children: any;
}

export function Chip({ variant = "default", onClose, children }: ChipProps) {
  return (
    <span class={`sc-chip${variant !== "default" ? ` sc-chip--${variant}` : ""}`}>
      {children}
      {onClose && (
        <button type="button" class="sc-chip__close" aria-label="削除" onClick={onClose}>
          ✕
        </button>
      )}
    </span>
  );
}

/** スケルトン */
export interface SkeletonProps {
  width?: string;
  height?: string;
  circle?: boolean;
}

export function Skeleton({ width = "100%", height = "1em", circle = false }: SkeletonProps) {
  return (
    <div
      class={`sc-skeleton${circle ? " sc-skeleton--circle" : " sc-skeleton--text"}`}
      style={{ width, height }}
    />
  );
}

/** 空状態 */
export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: any;
}

export function EmptyState({ icon = "📭", title, description, children }: EmptyStateProps) {
  return (
    <div class="sc-empty">
      <div class="sc-empty__icon">{icon}</div>
      <h3 class="sc-empty__title">{title}</h3>
      {description && <p class="sc-empty__desc">{description}</p>}
      {children}
    </div>
  );
}
