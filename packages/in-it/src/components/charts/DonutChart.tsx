/**
 * DonutChart — SVG donut/pie chart with legend and center label.
 *
 * @example
 * <DonutChart
 *   data={[
 *     { label: "Pro", value: 45, color: "var(--ii-primary)" },
 *     { label: "Free", value: 30, color: "var(--ii-info)" },
 *     { label: "Enterprise", value: 25, color: "var(--ii-success)" },
 *   ]}
 *   size={160}
 *   centerLabel="Users"
 * />
 */

/** @internal CSS for DonutChart — co-located for self-containment. */
export const DONUT_CHART_CSS = `/* --- Donut Chart --- */
.ii-chart-donut__segment {
  transition: opacity var(--ii-transition);
  animation: ii-chart-donut-draw 0.8s ease forwards;
  stroke-dashoffset: var(--ii-donut-offset, 0);
}
.ii-chart-donut__segment:hover {
  opacity: 0.8;
}
.ii-chart-donut__center-value {
  font-size: 1.5rem;
  font-weight: 700;
  fill: var(--ii-on-surface);
  text-anchor: middle;
  dominant-baseline: central;
}
.ii-chart-donut__center-label {
  font-size: 0.75rem;
  fill: var(--ii-on-surface-variant);
  text-anchor: middle;
}
.ii-chart-donut__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ii-spacing-3);
  margin-top: var(--ii-spacing-3);
  justify-content: center;
}
.ii-chart-donut__legend-item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-1);
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-chart-donut__legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
`;

export interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  thickness?: number;
  centerValue?: string;
  centerLabel?: string;
  showLegend?: boolean;
  class?: string;
}

const DEFAULT_COLORS = [
  "var(--ii-primary)",
  "var(--ii-info)",
  "var(--ii-success)",
  "var(--ii-warning)",
  "var(--ii-error)",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export function DonutChart({
  data,
  size = 160,
  thickness = 24,
  centerValue,
  centerLabel,
  showLegend = true,
  class: cls,
}: DonutChartProps): any {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const dashLen = pct * circumference;
    const dashOffset = -offset;
    offset += dashLen;
    return {
      ...d,
      color: d.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      dashLen,
      dashOffset,
    };
  });

  return (
    <div class={`ii-chart${cls ? ` ${cls}` : ""}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ margin: "0 auto", display: "block" }}>
        {/* Background track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ii-outline-variant)" stroke-width={thickness} opacity={0.3} />

        {/* Segments */}
        {segments.map((seg, i) => (
          <circle
            key={i}
            class="ii-chart-donut__segment"
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            stroke-width={thickness}
            stroke-dasharray={`${seg.dashLen} ${circumference - seg.dashLen}`}
            stroke-dashoffset={seg.dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              "--ii-donut-circumference": String(circumference),
              "--ii-donut-offset": String(seg.dashOffset),
            } as any}
          />
        ))}

        {/* Center text */}
        {centerValue && (
          <text class="ii-chart-donut__center-value" x={cx} y={centerLabel ? cy - 6 : cy}>{centerValue}</text>
        )}
        {centerLabel && (
          <text class="ii-chart-donut__center-label" x={cx} y={cy + 14}>{centerLabel}</text>
        )}
      </svg>

      {showLegend && (
        <div class="ii-chart-donut__legend">
          {segments.map((seg, i) => (
            <span key={i} class="ii-chart-donut__legend-item">
              <span class="ii-chart-donut__legend-dot" style={{ background: seg.color }} />
              {seg.label} ({Math.round((seg.value / total) * 100)}%)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
