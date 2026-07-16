
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Timeline — co-located for self-containment. */
const TIMELINE_CSS = `/* --- Timeline --- */
.ii-timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 24px;
}
.ii-timeline__item {
  position: relative;
  padding-bottom: var(--ii-spacing-5);
}
.ii-timeline__item:last-child {
  padding-bottom: 0;
}
/* Vertical line */
.ii-timeline__item::before {
  content: '';
  position: absolute;
  left: -18px;
  top: 10px;
  bottom: 0;
  width: 2px;
  background: var(--ii-outline-variant);
}
.ii-timeline__item:last-child::before {
  display: none;
}
/* Dot */
.ii-timeline__dot {
  position: absolute;
  left: -24px;
  top: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--ii-outline-variant);
  border: 2px solid var(--ii-surface);
  z-index: 1;
}
.ii-timeline__dot--info { background: var(--ii-info); }
.ii-timeline__dot--success { background: var(--ii-success); }
.ii-timeline__dot--warning { background: var(--ii-warning); }
.ii-timeline__dot--error { background: var(--ii-error); }
/* Content */
.ii-timeline__title {
  font-weight: 600;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  line-height: 1.4;
}
.ii-timeline__desc {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin-top: var(--ii-spacing-1);
}
.ii-timeline__date {
  font-size: var(--ii-font-xs);
  color: var(--ii-on-surface-variant);
  margin-top: var(--ii-spacing-1);
}
`;

/** A single event in the timeline. */
export interface TimelineItem {
  /** Event title. */
  title: string;
  /** Optional description text. */
  description?: string;
  /** Optional date string (displayed as-is, no formatting applied). */
  date?: string;
  /** Color variant for the dot. Default: "default" (neutral). */
  variant?: "default" | "info" | "success" | "warning" | "error";
}

/**
 * Props for the {@link Timeline} component.
 * @property items - Array of timeline events.
 * @property reverse - If true, renders newest first. Default: false (oldest first).
 * @property class - Additional CSS class.
 */
export interface TimelineProps {
  items: TimelineItem[];
  reverse?: boolean;
  class?: string;
}

/**
 * Vertical timeline displaying a chronological list of events.
 *
 * Unlike Steps (which shows "current position in a process"),
 * Timeline shows "past event history" with timestamps and
 * color-coded severity dots.
 *
 * @example
 * ```tsx
 * <Timeline items={[
 *   { date: "2026/01/15", title: "起票", description: "田中太郎", variant: "info" },
 *   { date: "2026/01/16", title: "承認", description: "山田花子", variant: "success" },
 * ]} />
 * ```
 */
export function Timeline({
  items,
  reverse = false,
  class: cls,
}: TimelineProps): any {
  injectCSS("ii-timeline", TIMELINE_CSS);
  const ordered = reverse ? [...items].reverse() : items;

  return (
    <div class={`ii-timeline${cls ? ` ${cls}` : ""}`}>
      {ordered.map((item, i) => {
        const dotCls = item.variant && item.variant !== "default"
          ? ` ii-timeline__dot--${item.variant}`
          : "";
        return (
          <div class="ii-timeline__item" key={i}>
            <div class={`ii-timeline__dot${dotCls}`} />
            <div class="ii-timeline__title">{item.title}</div>
            {item.description && (
              <div class="ii-timeline__desc">{item.description}</div>
            )}
            {item.date && (
              <div class="ii-timeline__date">{item.date}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
