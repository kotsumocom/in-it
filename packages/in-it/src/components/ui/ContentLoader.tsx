/**
 * ContentLoader — Loading / empty / data state handler.
 *
 * Replaces the common three-way conditional pattern:
 * `loading ? spinner : empty ? emptyState : children`
 *
 * @example
 * ```tsx
 * <ContentLoader
 *   loading={loading}
 *   empty={data.length === 0}
 *   emptyState={<EmptyState icon="file-text" title="No data" />}
 * >
 *   <DataTable ... />
 * </ContentLoader>
 * ```
 */
import { useLabels } from "../../locale.ts";
import type { LocaleStrings } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for ContentLoader — minimal, only for the loading text state. */
export const CONTENT_LOADER_CSS = `/* --- ContentLoader --- */
.ii-content-loader__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ii-spacing-8) var(--ii-spacing-4);
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-base);
}
`;

/** Props for the {@link ContentLoader} component. */
export interface ContentLoaderProps {
  /** Whether data is currently loading. */
  loading: boolean;
  /** Whether the loaded data is empty. Only checked when loading=false. */
  empty?: boolean;
  /** Element to render when empty=true. */
  emptyState?: any;
  /** Custom skeleton element to show during loading. Falls back to text. */
  skeleton?: any;
  /** Loading text. Defaults to locale "loading". */
  loadingText?: string;
  /** Data content to render when not loading and not empty. */
  children: any;
  /** Override built-in locale strings. */
  labels?: Partial<Pick<LocaleStrings, "loading">>;
}

/**
 * Handles the loading → empty → data state pattern.
 *
 * 1. `loading=true` → shows `skeleton` if provided, otherwise loading text
 * 2. `loading=false && empty=true` → shows `emptyState`
 * 3. `loading=false && empty=false` → shows `children`
 */
export function ContentLoader({
  loading,
  empty = false,
  emptyState,
  skeleton,
  loadingText,
  children,
  labels: labelOverrides,
}: ContentLoaderProps): any {
  injectCSS("ii-content-loader", CONTENT_LOADER_CSS);
  const l = useLabels(["loading"] as const, labelOverrides);

  if (loading) {
    if (skeleton) return skeleton;
    return (
      <div class="ii-content-loader__loading">
        {loadingText ?? l.loading}
      </div>
    );
  }

  if (empty) {
    return emptyState ?? null;
  }

  return children;
}
