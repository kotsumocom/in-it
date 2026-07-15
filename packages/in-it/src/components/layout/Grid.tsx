/**
 * Grid — Responsive auto-fit grid layout
 * Replaces `display: grid; grid-template-columns: repeat(auto-fit, minmax(...))` inline styles.
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for Grid layout — co-located for self-containment. */
export const GRID_CSS = `/* --- Grid --- */
.ii-grid { display: grid; gap: var(--ii-grid-gap, var(--ii-spacing-4)); }
`;

/** Props for the Grid layout component. */
export interface GridProps {
  /** Gap between items (maps to --ii-spacing-{N}). @default 4 */
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Minimum column width for auto-fit. @default "200px" */
  colMin?: string;
  /** Fixed number of columns. Overrides colMin when set. */
  cols?: number;
  children: any;
}

/**
 * Responsive auto-fit grid.
 * Uses CSS Grid with `auto-fit` for responsive column sizing,
 * or a fixed number of columns when `cols` is specified.
 *
 * @example Auto-fit (responsive)
 * ```tsx
 * <Grid>
 *   <StatCard label="Books" value="3" />
 *   <StatCard label="Political" value="2" />
 * </Grid>
 * ```
 *
 * @example Fixed columns
 * ```tsx
 * <Grid cols={3} gap={2}>
 *   <Card>A</Card>
 *   <Card>B</Card>
 *   <Card>C</Card>
 * </Grid>
 * ```
 */
export function Grid({
  gap = 4,
  colMin = "200px",
  cols,
  children,
}: GridProps): any {
  injectCSS("ii-grid", GRID_CSS);
  const columns = cols
    ? `repeat(${cols}, 1fr)`
    : `repeat(auto-fit, minmax(${colMin}, 1fr))`;
  return (
    <div
      class="ii-grid"
      style={{
        "--ii-grid-gap": `var(--ii-spacing-${gap})`,
        "grid-template-columns": columns,
      } as any}
    >
      {children}
    </div>
  );
}
