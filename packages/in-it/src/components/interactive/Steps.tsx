/**
 * Step indicator component
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for Steps — co-located for self-containment. */
export const STEPS_CSS = `/* --- Steps --- */
.ii-steps { display: flex; gap: 4px; }
.ii-steps--vertical { flex-direction: column; }
.ii-step { display: flex; align-items: center; gap: 8px; flex: 1; }
.ii-step__indicator {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: var(--ii-font-sm); font-weight: 600; flex-shrink: 0;
  border: 2px solid var(--ii-outline-variant); background: var(--ii-surface); color: var(--ii-on-surface-variant);
}
.ii-step--active .ii-step__indicator { border-color: var(--ii-primary); background: var(--ii-primary); color: var(--ii-on-primary); }
.ii-step--completed .ii-step__indicator { border-color: var(--ii-primary); background: var(--ii-primary); color: var(--ii-on-primary); }
.ii-step__content { flex: 1; min-width: 0; }
.ii-step__title { font-size: var(--ii-font-sm); font-weight: 600; }
.ii-step__desc { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-step__separator { flex: 1; height: 2px; background: var(--ii-outline-variant); margin: 0 8px; }
.ii-step--completed + .ii-step .ii-step__separator,
.ii-step--active + .ii-step .ii-step__separator { background: var(--ii-primary); }
`;

/** A single step with label and optional description. */
export interface StepItem {
  label: string;
  description?: string;
}

/** Props for the Steps component. */
export interface StepsProps {
  items: StepItem[];
  current?: number;
  orientation?: "horizontal" | "vertical";
}

/** Step indicator showing progress through a multi-step process. */
export function Steps({ items, current = 0, orientation = "horizontal" }: StepsProps): any {
  injectCSS("ii-steps", STEPS_CSS);
  return (
    <div class={`ii-steps ii-steps--${orientation}`} role="list">
      {items.map((item, i) => {
        const status = i < current ? "completed" : i === current ? "active" : "pending";
        return (
          <div key={i} class={`ii-steps__item ii-steps__item--${status}`} role="listitem">
            <div class="ii-steps__indicator">
              {status === "completed" ? "✓" : i + 1}
            </div>
            <div class="ii-steps__content">
              <div class="ii-steps__label">{item.label}</div>
              {item.description && <div class="ii-steps__desc">{item.description}</div>}
            </div>
            {i < items.length - 1 && <div class="ii-steps__separator" />}
          </div>
        );
      })}
    </div>
  );
}