/**
 * Pagination — Pagination component
 */
import { useState, useMemo } from "hono/jsx";

export interface PaginationProps {
  total: number;
  pageSize?: number;
  defaultPage?: number;
  siblingCount?: number;
  onChange?: (page: number) => void;
}

export function Pagination({ total, pageSize = 10, defaultPage = 1, siblingCount = 1, onChange }: PaginationProps) {
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
    <nav class="ii-pagination" aria-label="Pagination">
      <button class="ii-pagination__btn" disabled={current === 1} onClick={() => go(current - 1)} aria-label="Previous page">
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
      <button class="ii-pagination__btn" disabled={current === totalPages} onClick={() => go(current + 1)} aria-label="Next page">
        →
      </button>
    </nav>
  );
}
