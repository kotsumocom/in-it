/**
 * Stack — Vertical flex layout
 * Replaces `display: flex; flex-direction: column; gap: ...` inline styles.
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for Stack layout — co-located for self-containment. */
export const STACK_CSS = `/* --- Stack --- */
.ii-stack { display: flex; flex-direction: column; gap: var(--ii-stack-gap, var(--ii-spacing-3)); }
`;

/** Props for the Stack layout component. */
export interface StackProps {
  /** Gap between items (maps to --ii-spacing-{N}). @default 3 */
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  children: any;
}

/**
 * Vertical flex layout.
 * Stacks children vertically with consistent spacing.
 *
 * @example
 * ```tsx
 * <Stack gap={2}>
 *   <Card>First</Card>
 *   <Card>Second</Card>
 * </Stack>
 * ```
 */
export function Stack({ gap = 3, children }: StackProps): any {
  injectCSS("ii-stack", STACK_CSS);
  return (
    <div
      class="ii-stack"
      style={{ "--ii-stack-gap": `var(--ii-spacing-${gap})` } as any}
    >
      {children}
    </div>
  );
}
