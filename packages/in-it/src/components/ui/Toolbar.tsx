
import { injectCSS } from "../../inject.ts";
import { useLabels } from "../../locale.ts";

/** @internal CSS for Toolbar — co-located for self-containment. */
const TOOLBAR_CSS = `/* --- Toolbar --- */
.ii-toolbar {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  background: var(--ii-surface-container-low);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  flex-wrap: wrap;
}
.ii-toolbar__search {
  flex: 1;
  min-width: 180px;
}
.ii-toolbar__search input {
  width: 100%;
  min-height: 36px;
  padding: 6px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface);
  transition: border-color var(--ii-transition);
}
.ii-toolbar__search input:focus {
  outline: none;
  border-color: var(--ii-primary);
}
.ii-toolbar__search input::placeholder {
  color: var(--ii-on-surface-variant);
}
.ii-toolbar__filters {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  flex-wrap: wrap;
}
.ii-toolbar__count {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  white-space: nowrap;
  margin-left: auto;
}
`;

/** Search field configuration for the Toolbar. */
export interface ToolbarSearchConfig {
  /** Placeholder text. Defaults to the locale search string. */
  placeholder?: string;
  /** Current search value (controlled). */
  value: string;
  /** Callback when search value changes. */
  onChange: (value: string) => void;
}

/**
 * Props for the {@link Toolbar} component.
 * @property search - Optional search field configuration.
 * @property children - Optional filter/sort elements rendered in the filters area.
 * @property count - Optional item count to display.
 * @property countLabel - Label for count (e.g. "items"). Defaults to locale.
 * @property class - Additional CSS class.
 */
export interface ToolbarProps {
  search?: ToolbarSearchConfig;
  children?: any;
  count?: number;
  countLabel?: string;
  class?: string;
}

/**
 * Page-level toolbar combining search, filters, and item count.
 *
 * Search and count are provided via props for consistent placement.
 * Filters and sort controls are passed as children for flexibility.
 *
 * @example
 * ```tsx
 * <Toolbar
 *   search={{ value: query, onChange: setQuery }}
 *   count={filtered.length}
 * >
 *   <Select options={STATUS_OPTIONS} value={status} onChange={setStatus} />
 * </Toolbar>
 * ```
 */
export function Toolbar({
  search,
  children,
  count,
  countLabel,
  class: cls,
}: ToolbarProps): any {
  injectCSS("ii-toolbar", TOOLBAR_CSS);
  const l = useLabels(["search"] as const);
  const placeholder = search?.placeholder ?? l.search;

  return (
    <div class={`ii-toolbar${cls ? ` ${cls}` : ""}`}>
      {search && (
        <div class="ii-toolbar__search">
          <input
            type="text"
            placeholder={placeholder}
            value={search.value}
            onInput={(e: Event) =>
              search.onChange((e.target as HTMLInputElement).value)
            }
          />
        </div>
      )}
      {children && (
        <div class="ii-toolbar__filters">
          {children}
        </div>
      )}
      {count != null && (
        <span class="ii-toolbar__count">
          {count.toLocaleString()} {countLabel ?? (count === 1 ? "item" : "items")}
        </span>
      )}
    </div>
  );
}
