
/** @internal CSS for Skeleton — co-located for self-containment. */
export const SKELETON_CSS = `/* --- Skeleton --- */
.ii-skeleton {
  background: linear-gradient(90deg, var(--ii-surface-container) 25%, var(--ii-surface-container-high) 50%, var(--ii-surface-container) 75%);
  background-size: 200% 100%;
  animation: ii-skeleton-shimmer 1.5s infinite;
  border-radius: var(--ii-shape-sm);
}
.ii-skeleton--text { height: 1em; width: 100%; }
.ii-skeleton--circle { border-radius: 50%; }
@keyframes ii-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

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
