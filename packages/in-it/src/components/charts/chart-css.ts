/**
 * @module chart-css
 * Shared CSS for chart components (container, tooltip, animations).
 * Component-specific CSS is co-located in each chart's .tsx file.
 */

/** Shared chart container CSS. */
export const CHART_BASE_CSS = `/* --- Charts: shared --- */
.ii-chart {
  position: relative;
  width: 100%;
}
.ii-chart svg {
  width: 100%;
  height: auto;
  display: block;
}
`;

/** Shared chart tooltip CSS. */
export const CHART_TOOLTIP_CSS = `/* --- Chart Tooltip --- */
.ii-chart-tooltip {
  position: absolute;
  background: var(--ii-on-surface);
  color: var(--ii-surface);
  padding: 4px 8px;
  border-radius: var(--ii-shape-sm);
  font-size: var(--ii-font-sm);
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  animation: ii-fade-in 0.1s ease;
}
.ii-chart-tooltip::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--ii-on-surface);
}
`;

/** Shared chart animations. */
export const CHART_ANIMATIONS_CSS = `/* --- Chart Animations --- */
@keyframes ii-chart-grow-up {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
@keyframes ii-chart-donut-draw {
  from { stroke-dashoffset: var(--ii-donut-circumference, 0); }
  to { stroke-dashoffset: var(--ii-donut-offset, 0); }
}
`;

/** Combined shared chart CSS. */
export const CHART_SHARED_CSS: string = [CHART_BASE_CSS, CHART_TOOLTIP_CSS, CHART_ANIMATIONS_CSS].join("\n");
