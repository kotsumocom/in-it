/**
 * BarChart — SVG bar chart with tooltips and animation.
 *
 * @example
 * <BarChart
 *   data={[120, 340, 280, 450, 380]}
 *   labels={["Jan", "Feb", "Mar", "Apr", "May"]}
 *   height={200}
 * />
 */
import { useState } from "hono/jsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for BarChart — co-located for self-containment. */
export const BAR_CHART_CSS = `/* --- Bar Chart --- */
.ii-chart-bar__bar {
  fill: var(--ii-primary);
  transition: opacity var(--ii-transition);
  animation: ii-chart-grow-up 0.6s ease forwards;
  transform-origin: bottom;
}
.ii-chart-bar__bar:hover {
  opacity: 0.8;
}
.ii-chart-bar__label {
  font-size: 11px;
  fill: var(--ii-on-surface-variant);
  text-anchor: middle;
}
.ii-chart-bar__value {
  font-size: 11px;
  fill: var(--ii-on-surface);
  text-anchor: middle;
  font-weight: 500;
}
`;

export interface BarChartProps {
  data: number[];
  labels?: string[];
  colors?: string[];
  height?: number;
  showValues?: boolean;
  class?: string;
}

export function BarChart({
  data,
  labels,
  colors,
  height = 200,
  showValues = true,
  class: cls,
}: BarChartProps): any {
  injectCSS("ii-bar-chart", BAR_CHART_CSS);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: string } | null>(null);
  const max = Math.max(...data, 1);
  const padding = { top: 20, right: 16, bottom: labels ? 28 : 8, left: 16 };
  const chartW = 100; // percentage-based
  const barCount = data.length;
  const gap = 2;
  const barW = (chartW - padding.left - padding.right - gap * (barCount - 1)) / barCount;

  // Use viewBox for responsiveness
  const vw = 400;
  const vh = height;
  const bw = (vw - padding.left - padding.right - gap * (barCount - 1)) / barCount;
  const chartH = vh - padding.top - padding.bottom;

  return (
    <div class={`ii-chart${cls ? ` ${cls}` : ""}`}>
      <svg viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet">
        {data.map((v, i) => {
          const barH = (v / max) * chartH;
          const x = padding.left + i * (bw + gap);
          const y = padding.top + chartH - barH;
          const color = colors?.[i % (colors?.length ?? 1)] ?? undefined;

          return (
            <g key={i}>
              <rect
                class="ii-chart-bar__bar"
                x={x}
                y={y}
                width={bw}
                height={barH}
                rx={3}
                fill={color}
                style={{ animationDelay: `${i * 0.05}s` }}
                onMouseEnter={(e: MouseEvent) => {
                  const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
                  if (rect) {
                    setTooltip({
                      x: ((x + bw / 2) / vw) * rect.width,
                      y: (y / vh) * rect.height - 8,
                      value: String(v),
                    });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              {showValues && (
                <text class="ii-chart-bar__value" x={x + bw / 2} y={y - 4}>{v}</text>
              )}
              {labels?.[i] && (
                <text class="ii-chart-bar__label" x={x + bw / 2} y={vh - 4}>{labels[i]}</text>
              )}
            </g>
          );
        })}
      </svg>
      {tooltip && (
        <div class="ii-chart-tooltip" style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: "translateX(-50%)" }}>
          {tooltip.value}
        </div>
      )}
    </div>
  );
}
