/** Props for the {@link Badge} component.
 * @property variant - Visual style: success, error, warning, info, or neutral (default).
 * @property children - Badge content.
 */
import { BADGE_CSS, CARD_CSS, BUTTON_CSS, STAT_CARD_CSS, DATA_TABLE_CSS, INPUT_CSS, AVATAR_CSS, CHIP_CSS, SKELETON_CSS, EMPTY_STATE_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
import { t } from "../../locale.ts";
export interface BadgeProps {
  variant?: "success" | "error" | "warning" | "info" | "neutral";
  children: any;
}

/** Small inline status label rendered as a `<span>` with color-coded variants. */
export function Badge({ variant = "neutral", children }: BadgeProps): any {
  injectCSS("ii-badge", BADGE_CSS);
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
  injectCSS("ii-card", CARD_CSS);
  return (
    <div class={`ii-card${outlined ? " ii-card--outlined" : ""}${cls ? ` ${cls}` : ""}`}>
      {children}
    </div>
  );
}

/** Props for the {@link Button} component.
 * @property variant - filled (default), tonal, elevated, outlined, or text.
 * @property size - sm, md (default), or lg.
 * @property leadingIcon - Icon element displayed before the label.
 * @property trailingIcon - Icon element displayed after the label.
 */
export interface ButtonProps {
  variant?: "filled" | "tonal" | "elevated" | "outlined" | "text";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  leadingIcon?: any;
  trailingIcon?: any;
  children: any;
  class?: string;
}

/** Interactive button with filled, tonal, elevated, outlined, or text variants, three sizes, and optional leading/trailing icons. */
export function Button({
  variant = "filled",
  size = "md",
  disabled = false,
  type = "button",
  onClick,
  leadingIcon,
  trailingIcon,
  children,
  class: cls,
}: ButtonProps): any {
  injectCSS("ii-btn", BUTTON_CSS);
  const mods = [
    `ii-btn--${variant}`,
    `ii-btn--${size}`,
    leadingIcon && "ii-btn--has-leading",
    trailingIcon && "ii-btn--has-trailing",
    cls,
  ].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      class={`ii-btn ${mods}`}
      disabled={disabled}
      onClick={onClick}
    >
      {leadingIcon && <span class="ii-btn__icon">{leadingIcon}</span>}
      {children}
      {trailingIcon && <span class="ii-btn__icon">{trailingIcon}</span>}
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
  injectCSS("ii-stat", STAT_CARD_CSS);
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
  injectCSS("ii-table", DATA_TABLE_CSS);
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
  /** HTML id attribute for the input element. */
  id?: string;
  /** HTML name attribute for form submission. */
  name?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Autocomplete hint. */
  autocomplete?: string;
  /** Minimum input length. */
  minLength?: number;
  /** Additional CSS class. */
  class?: string;
}

/** Text input field with optional label, helper text, and error state. Error takes priority over helper. */
export function Input({ label, placeholder, value, type = "text", helper, error, disabled, onInput, id, name, required, autocomplete, minLength, class: cls }: InputProps): any {
  injectCSS("ii-input", INPUT_CSS);
  return (
    <div class={`ii-input${cls ? ` ${cls}` : ""}`}>
      {label && <label class="ii-input__label" for={id}>{label}</label>}
      <input
        id={id}
        name={name}
        type={type}
        class="ii-input__field"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        required={required}
        autocomplete={autocomplete}
        minLength={minLength}
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
  injectCSS("ii-avatar", AVATAR_CSS);
  const initials = name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";
  return (
    <div class={`ii-avatar ii-avatar--${size}`}>
      {src ? <img src={src} alt={name ?? ""} /> : initials}
    </div>
  );
}

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
  injectCSS("ii-skeleton", SKELETON_CSS);
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
  injectCSS("ii-empty", EMPTY_STATE_CSS);
  return (
    <div class="ii-empty">
      <div class="ii-empty__icon">{icon}</div>
      <h3 class="ii-empty__title">{title}</h3>
      {description && <p class="ii-empty__desc">{description}</p>}
      {children}
    </div>
  );
}