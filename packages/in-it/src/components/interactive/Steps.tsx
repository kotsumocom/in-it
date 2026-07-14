/**
 * Step indicator component
 */

/** A single step with label and optional description. */
import { STEPS_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";
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