/**
 * Tooltip — ツールチップコンポーネント
 */
import { useState, useRef } from "hono/jsx";

export interface TooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  children: any;
}

export function Tooltip({ content, position = "top", children }: TooltipProps) {
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
