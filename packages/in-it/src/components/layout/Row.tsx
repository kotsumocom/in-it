/**
 * Row — Horizontal flex layout
 * Replaces `display: flex; align-items: center; gap: ...` inline styles.
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for Row layout — co-located for self-containment. */
export const ROW_CSS = `/* --- Row --- */
.ii-row { display: flex; gap: var(--ii-row-gap, var(--ii-spacing-3)); }
`;

/** Props for the Row layout component. */
export interface RowProps {
  /** Gap between items (maps to --ii-spacing-{N}). @default 3 */
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Horizontal alignment. @default "start" */
  justify?: "start" | "center" | "end" | "between";
  /** Vertical alignment. @default "center" */
  align?: "start" | "center" | "end" | "stretch";
  /** Allow items to wrap to next line. @default false */
  wrap?: boolean;
  children: any;
}

const JUSTIFY_MAP: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
};

const ALIGN_MAP: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

/**
 * Horizontal flex layout.
 * Lays out children in a row with consistent spacing and alignment.
 *
 * @example
 * ```tsx
 * <Row gap={3} justify="end">
 *   <Button>Cancel</Button>
 *   <Button variant="filled">Save</Button>
 * </Row>
 * ```
 */
export function Row({
  gap = 3,
  justify = "start",
  align = "center",
  wrap = false,
  children,
}: RowProps): any {
  injectCSS("ii-row", ROW_CSS);
  const style: Record<string, string> = {
    "--ii-row-gap": `var(--ii-spacing-${gap})`,
    "align-items": ALIGN_MAP[align],
    "justify-content": JUSTIFY_MAP[justify],
  };
  if (wrap) style["flex-wrap"] = "wrap";
  return (
    <div class="ii-row" style={style}>
      {children}
    </div>
  );
}
