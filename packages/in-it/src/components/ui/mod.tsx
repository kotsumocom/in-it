/** Props for the {@link Badge} component.
 * @property variant - Visual style: success, error, warning, info, or neutral (default).
 * @property children - Badge content.
 */
export interface BadgeProps {
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  children: any;
}

/** Small inline status label rendered as a `<span>` with color-coded variants. */
export function Badge({ variant = "neutral", children }: BadgeProps): any {
  return (
    <span class={`ii-badge ii-badge--${variant}`}>
      {children}
    </span>
  );
}

/** Props for the {@link Card} component.
 * @property outlined - If true, uses a border instead of elevation.
 * @property class - Additional CSS class names.
 */
export interface CardProps {
  outlined?: boolean;
  children: any;
  class?: string;
}

/** Surface container for grouping related content. Supports filled (default) and outlined styles. */
export function Card({ outlined = false, children, class: cls }: CardProps): any {
  return (
    <div class={`ii-card${outlined ? " ii-card--outlined" : ""}${cls ? ` ${cls}` : ""}`}>
      {children}
    </div>
  );
}

/** Props for the {@link Button} component.
 * @property variant - filled (elevated), outlined (bordered), or text (minimal).
 * @property size - sm, md (default), or lg.
 */
export interface ButtonProps {
  variant?: "filled" | "outlined" | "text";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: any;
  class?: string;
}

/** Interactive button element with filled, outlined, or text variants and three size options. */
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

/** Props for the {@link StatCard} component.
 * @property label - Metric name displayed above the value.
 * @property value - The main numeric or text value.
 * @property trend - Optional trend text (e.g., "+12%").
 * @property trendUp - If true, styles trend as positive; otherwise negative.
 */
export interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

/** Dashboard metric card displaying a label, value, and optional up/down trend indicator. */
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

/** Column definition for the {@link DataTable} component.
 * @property key - Object property to read from each row.
 * @property header - Column header text (falls back to label, then key).
 * @property render - Custom cell renderer receiving the cell value and full row.
 * @property align - Text alignment: left, center, or right.
 */
export interface DataTableColumn<T> {
  key: keyof T & string;
  header?: string;
  label?: string;
  render?: (value: any, row: T) => any;
  align?: "left" | "center" | "right";
}

/** Props for the {@link DataTable} component.
 * @property columns - Column definitions.
 * @property data - Array of row objects.
 * @property rowKey - Function to derive a unique key for each row.
 */
export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey?: (row: T) => string;
}

/** Responsive HTML table with configurable columns, custom cell renderers, and column alignment. */
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

/** Props for the {@link Input} component.
 * @property label - Label text above the input field.
 * @property helper - Hint text shown below the field (hidden when error is set).
 * @property error - Error message shown below the field, overrides helper.
 */
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

/** Text input field with optional label, helper text, and error state. Error takes priority over helper. */
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

/** Props for the {@link Avatar} component.
 * @property name - User's full name; initials are derived from the first letters of each word (max 2).
 * @property src - Image URL. When provided, displays the image instead of initials.
 * @property size - sm (small), md (default), or lg (large).
 */
export interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

/** Circular avatar displaying a user image or auto-generated initials from the user's name. */
export function Avatar({ name, src, size = "md" }: AvatarProps): any {
  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  return (
    <div class={`ii-avatar ii-avatar--${size}`}>
      {src ? <img src={src} alt={name ?? ""} /> : initials}
    </div>
  );
}

/** Props for the {@link Chip} component.
 * @property variant - Color variant: default, primary, success, or error.
 * @property onClose - When provided, renders a close button that calls this handler.
 */
export interface ChipProps {
  variant?: "default" | "primary" | "success" | "error";
  onClose?: () => void;
  children: any;
}

/** Compact label element for tags, filters, or selections. Supports an optional dismiss button. */
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

/** Props for the {@link Skeleton} component.
 * @property width - CSS width value (default: "100%").
 * @property height - CSS height value (default: "1em").
 * @property circle - If true, renders a circular skeleton instead of a text block.
 */
export interface SkeletonProps {
  width?: string;
  height?: string;
  circle?: boolean;
}

/** Animated placeholder block indicating content is loading. Supports text-line and circle shapes. */
export function Skeleton({ width = "100%", height = "1em", circle = false }: SkeletonProps): any {
  return (
    <div
      class={`ii-skeleton${circle ? " ii-skeleton--circle" : " ii-skeleton--text"}`}
      style={{ width, height }}
    />
  );
}

/** Props for the {@link EmptyState} component.
 * @property icon - Emoji or icon string displayed above the title.
 * @property title - Heading text.
 * @property description - Optional body text below the title.
 * @property children - Optional action elements (e.g., a button).
 */
export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: any;
}

/** Centered placeholder for empty lists or search results, with icon, title, description, and optional actions. */
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