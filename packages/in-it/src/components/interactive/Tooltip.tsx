/**
 * Tooltip component
 */
import { useState, useRef } from "hono/jsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Tooltip — co-located for self-containment. */
export const TOOLTIP_CSS = `/* --- Tooltip --- */
.ii-tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.ii-tooltip {
  position: absolute;
  background: var(--ii-on-surface);
  color: var(--ii-surface);
  padding: 4px 8px;
  border-radius: var(--ii-shape-sm);
  font-size: var(--ii-font-sm);
  white-space: nowrap;
  pointer-events: none;
  z-index: 50;
  animation: ii-fade-in 100ms ease;
}
.ii-tooltip--top { bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 6px; }
.ii-tooltip--bottom { top: 100%; left: 50%; transform: translateX(-50%); margin-top: 6px; }
.ii-tooltip--left { right: 100%; top: 50%; transform: translateY(-50%); margin-right: 6px; }
.ii-tooltip--right { left: 100%; top: 50%; transform: translateY(-50%); margin-left: 6px; }
`;

/** Props for the Tooltip component. */
export interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: any;
}

/** Informational tooltip shown on hover/focus with configurable position. */
export function Tooltip({ content, position = "top", children }: TooltipProps): any {
  injectCSS("ii-tooltip", TOOLTIP_CSS);
  const [visible, setVisible] = useState(false);

  return (
    <span class="ii-tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}>
      {children}
      {visible && (
        <span class={`ii-tooltip ii-tooltip--${position}`} role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
}