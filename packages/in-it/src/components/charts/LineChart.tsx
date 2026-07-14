/**
 * LineChart — SVG line chart with area fill, dots, grid, and tooltips.
 *
 * @example
 * <LineChart
 *   data={[30, 45, 28, 60, 48, 72, 55]}
 *   labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
 *   height={200}
 *   area
 * />
 */
import { useState } from "hono/jsx";
import { CHART_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";

export interface LineChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  color?: string;
  area?: boolean;
  showDots?: boolean;
  showGrid?: boolean;
  class?: string;
}

export function LineChart({
  data,
  labels,
  height = 200,
  color,
  area = false,
  showDots = true,
  showGrid = true,
  class: cls,
}: LineChartProps): any {
  injectCSS("ii-chart", CHART_CSS);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: string } | null>(null);

  const vw = 400;
  const vh = height;
  const pad = { top: 16, right: 16, bottom: labels ? 28 : 8, left: 40 };
  const chartW = vw - pad.left - pad.right;
  const chartH = vh - pad.top - pad.bottom;

  const max = Math.max(...data, 1);
  const min = 0;
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1 || 1)) * chartW,
    y: pad.top + chartH - ((v - min) / range) * chartH,
    value: v,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${pad.top + chartH} L ${points[0].x} ${pad.top + chartH} Z`;

  // Grid lines (4 horizontal)
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = pad.top + (i / 4) * chartH;
    const val = Math.round(max - (i / 4) * range);
    return { y, val };
  });

  return (
    <div class={`ii-chart${cls ? ` ${cls}` : ""}`}>
      <svg viewBox={`0 0 ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {showGrid && gridLines.map((g, i) => (
          <g key={i}>
            <line class="ii-chart-line__grid" x1={pad.left} y1={g.y} x2={vw - pad.right} y2={g.y} />
            <text class="ii-chart-line__axis-label" x={pad.left - 6} y={g.y + 4} text-anchor="end">{g.val}</text>
          </g>
        ))}

        {/* Area */}
        {area && <path class="ii-chart-line__area" d={areaPath} style={color ? { fill: color } : undefined} />}

        {/* Line */}
        <path class="ii-chart-line__line" d={linePath} style={color ? { stroke: color } : undefined} />

        {/* Dots */}
        {showDots && points.map((p, i) => (
          <circle
            key={i}
            class="ii-chart-line__dot"
            cx={p.x}
            cy={p.y}
            r={4}
            style={color ? { fill: color } : undefined}
            onMouseEnter={(e: MouseEvent) => {
              const rect = (e.target as SVGElement).closest("svg")?.getBoundingClientRect();
              if (rect) {
                setTooltip({
                  x: (p.x / vw) * rect.width,
                  y: (p.y / vh) * rect.height - 12,
                  value: `${labels?.[i] ? `${labels[i]}: ` : ""}${p.value}`,
                });
              }
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}

        {/* Labels */}
        {labels && points.map((p, i) => (
          labels[i] ? <text key={i} class="ii-chart-bar__label" x={p.x} y={vh - 4}>{labels[i]}</text> : null
        ))}
      </svg>
      {tooltip && (
        <div class="ii-chart-tooltip" style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px`, transform: "translateX(-50%)" }}>
          {tooltip.value}
        </div>
      )}
    </div>
  );
}
