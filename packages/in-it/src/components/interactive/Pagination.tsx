/**
 * Pagination component
 */
import { useState, useMemo } from "hono/jsx";
import { useLabels } from "../../locale.ts";
import type { LocaleStrings } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Pagination — co-located for self-containment. */
export const PAGINATION_CSS = `/* --- Pagination --- */
.ii-pagination { display: flex; align-items: center; gap: 4px; }
.ii-pagination__btn {
  display: flex; align-items: center; justify-content: center;
  min-width: 36px; height: 36px; border-radius: var(--ii-shape-sm);
  border: none; background: transparent; cursor: pointer; font-family: inherit;
  font-size: var(--ii-font-sm); font-weight: 500; color: var(--ii-on-surface);
  transition: all var(--ii-transition);
}
.ii-pagination__btn:hover { background: var(--ii-surface-container-high); }
.ii-pagination__btn--active { background: var(--ii-primary); color: var(--ii-on-primary); }
.ii-pagination__btn:disabled { opacity: 0.38; cursor: not-allowed; }
.ii-pagination__ellipsis { padding: 0 4px; color: var(--ii-on-surface-variant); }
`;

/** Locale keys used by Pagination. */
type PaginationLabelKeys = "pagination" | "previousPage" | "nextPage";

const PAGINATION_KEYS: readonly PaginationLabelKeys[] = [
  "pagination", "previousPage", "nextPage",
] as const;

/** Props for the Pagination component. */
export interface PaginationProps {
  total: number;
  pageSize?: number;
  defaultPage?: number;
  siblingCount?: number;
  onChange?: (page: number) => void;
  /** Override built-in locale strings. */
  labels?: Partial<Pick<LocaleStrings, PaginationLabelKeys>>;
}

/** Page navigation with ellipsis, prev/next buttons, and keyboard support. */
export function Pagination({ total, pageSize = 10, defaultPage = 1, siblingCount = 1, onChange, labels: labelOverrides }: PaginationProps): any {
  injectCSS("ii-pagination", PAGINATION_CSS);
  const l = useLabels(PAGINATION_KEYS, labelOverrides);
  const [current, setCurrent] = useState(defaultPage);
  const totalPages = Math.ceil(total / pageSize);

  const pages = useMemo(() => {
    const result: (number | "...")[] = [];
    const left = Math.max(1, current - siblingCount);
    const right = Math.min(totalPages, current + siblingCount);

    if (left > 1) {
      result.push(1);
      if (left > 2) result.push("...");
    }
    for (let i = left; i <= right; i++) result.push(i);
    if (right < totalPages) {
      if (right < totalPages - 1) result.push("...");
      result.push(totalPages);
    }
    return result;
  }, [current, totalPages, siblingCount]);

  const go = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrent(page);
    onChange?.(page);
  };

  return (
    <nav class="ii-pagination" aria-label={l.pagination}>
      <button class="ii-pagination__btn" disabled={current === 1} onClick={() => go(current - 1)} aria-label={l.previousPage}>
        ←
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`e${i}`} class="ii-pagination__ellipsis">…</span>
        ) : (
          <button key={p} class={`ii-pagination__btn${p === current ? " ii-pagination__btn--active" : ""}`}
            onClick={() => go(p as number)} aria-current={p === current ? "page" : undefined}>
            {p}
          </button>
        )
      )}
      <button class="ii-pagination__btn" disabled={current === totalPages} onClick={() => go(current + 1)} aria-label={l.nextPage}>
        →
      </button>
    </nav>
  );
}