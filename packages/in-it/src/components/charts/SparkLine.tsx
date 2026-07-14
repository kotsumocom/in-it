/**
 * SparkLine — Minimal inline line chart for stat cards.
 *
 * @example
 * <SparkLine data={[10, 25, 18, 32, 28, 40]} width={80} height={24} />
 */

/** @internal CSS for SparkLine — co-located for self-containment. */
export const SPARK_LINE_CSS = `/* --- SparkLine --- */
.ii-sparkline {
  display: inline-block;
}
.ii-sparkline__line {
  fill: none;
  stroke: var(--ii-primary);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.ii-sparkline--success .ii-sparkline__line { stroke: var(--ii-success); }
.ii-sparkline--error .ii-sparkline__line { stroke: var(--ii-error); }
`;

export interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  variant?: "default" | "success" | "error";
  class?: string;
}

export function SparkLine({
  data,
  width = 80,
  height = 24,
  color,
  variant = "default",
  class: cls,
}: SparkLineProps): any {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  });

  return (
    <svg
      class={`ii-sparkline${variant !== "default" ? ` ii-sparkline--${variant}` : ""}${cls ? ` ${cls}` : ""}`}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        class="ii-sparkline__line"
        points={points.join(" ")}
        style={color ? { stroke: color } : undefined}
      />
    </svg>
  );
}
