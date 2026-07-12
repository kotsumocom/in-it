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
