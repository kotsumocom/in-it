/**
 * Tooltip component
 */
import { useState, useRef } from "hono/jsx";
import { POPOVER_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";

/** Props for the Tooltip component. */
export interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: any;
}

/** Informational tooltip shown on hover/focus with configurable position. */
export function Tooltip({ content, position = "top", children }: TooltipProps): any {
  injectCSS("ii-popover", POPOVER_CSS);
  const [visible, setVisible] = useState(false);

  return (
    <span class="ii-tooltip-wrapper" style={{ position: "relative", display: "inline-block" }}
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