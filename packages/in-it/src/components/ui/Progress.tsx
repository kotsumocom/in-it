
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Progress — co-located for self-containment. */
export const PROGRESS_CSS = `/* --- Progress Bar --- */
.ii-progress { display: flex; flex-direction: column; gap: 6px; }
.ii-progress__label { display: flex; justify-content: space-between; font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); }
.ii-progress__track { height: 4px; background: var(--ii-outline-variant); border-radius: 2px; overflow: hidden; }
.ii-progress__fill { height: 100%; background: var(--ii-primary); border-radius: 2px; transition: width 300ms ease; }
.ii-progress__fill--indeterminate {
  width: 40%; animation: ii-progress-indeterminate 1.5s infinite ease-in-out;
}
@keyframes ii-progress-indeterminate {
  0% { transform: translateX(-100%); } 100% { transform: translateX(350%); }
}

/* --- Progress Circular --- */
.ii-progress-circular { display: inline-flex; position: relative; }
.ii-progress-circular__svg { transform: rotate(-90deg); }
.ii-progress-circular__track { stroke: var(--ii-outline-variant); fill: none; }
.ii-progress-circular__fill { stroke: var(--ii-primary); fill: none; stroke-linecap: round; transition: stroke-dashoffset 300ms ease; }
.ii-progress-circular__label {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: var(--ii-font-sm); font-weight: 600; color: var(--ii-on-surface);
}
`;

/** Props for the Progress bar component. */
export interface ProgressProps {
  value?: number;
  max?: number;
  label?: string;
}

/** Horizontal progress bar with optional label. */
export function Progress({ value = 0, max = 100, label }: ProgressProps): any {
  injectCSS("ii-progress", PROGRESS_CSS);
  const pct = Math.round((value / max) * 100);
  return (
    <div class="ii-progress" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      {label && <div class="ii-progress__label">{label} {pct}%</div>}
      <div class="ii-progress__track">
        <div class="ii-progress__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Props for the ProgressCircular component. */
export interface ProgressCircularProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
}

/** Circular/radial progress indicator with percentage display. */
export function ProgressCircular({ value = 0, size = 48, strokeWidth = 4 }: ProgressCircularProps): any {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg class="ii-progress-circular" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="progressbar" aria-valuenow={value}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" class="ii-progress-circular__track" stroke-width={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" class="ii-progress-circular__fill" stroke-width={strokeWidth}
        stroke-dasharray={c} stroke-dashoffset={offset} stroke-linecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dashoffset 0.3s" }} />
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="ii-progress-circular__label" font-size="0.75rem">
        {value}%
      </text>
    </svg>
  );
}
