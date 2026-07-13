/**
 * Tooltip component
 */
import { useState, useRef } from "hono/jsx";

/** Props for the Tooltip component. */
export interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: any;
}

/** Informational tooltip shown on hover/focus with configurable position. */
export function Tooltip({ content, position = "top", children }: TooltipProps): any {
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