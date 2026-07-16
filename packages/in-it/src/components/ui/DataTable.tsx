
import { injectCSS } from "../../inject.ts";

/** @internal CSS for DataTable — co-located for self-containment. */
export const DATA_TABLE_CSS = `/* --- Data Table --- */
.ii-data-table-wrap {
  overflow-x: auto;
}
.ii-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ii-font-base);
}
.ii-data-table th {
  text-align: left;
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
  border-bottom: 1px solid var(--ii-outline-variant);
  font-size: var(--ii-font-sm);
}
.ii-data-table td {
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-data-table__th--right, .ii-data-table__td--right { text-align: right; }
.ii-data-table__th--center, .ii-data-table__td--center { text-align: center; }
.ii-data-table tfoot td {
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  border-top: 2px solid var(--ii-outline-variant);
  font-weight: 600;
  color: var(--ii-on-surface);
}
`;

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
  /** Optional footer content rendered inside `<tfoot>`. Accepts `<tr>` elements. */
  footer?: any;
}

/** Responsive HTML table with configurable columns, custom cell renderers, and column alignment. */
export function DataTable<T>({ columns, data, rowKey, footer }: DataTableProps<T>): any {
  injectCSS("ii-data-table", DATA_TABLE_CSS);
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
        {footer && <tfoot>{footer}</tfoot>}
      </table>
    </div>
  );
}
