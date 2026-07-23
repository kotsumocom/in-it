/**
 * DateRangePicker — Select a start and end date with optional presets.
 *
 * Uses native `<input type="date">` for maximum compatibility
 * and zero external dependencies. Provides common presets
 * (today, this week, this month) for quick selection.
 *
 * @example
 * ```tsx
 * const [range, setRange] = useState({ start: "", end: "" });
 *
 * <DateRangePicker
 *   startDate={range.start}
 *   endDate={range.end}
 *   onChange={(start, end) => setRange({ start, end })}
 * />
 *
 * // With presets and labels
 * <DateRangePicker
 *   startDate={range.start}
 *   endDate={range.end}
 *   onChange={(start, end) => setRange({ start, end })}
 *   presets={["today", "thisWeek", "thisMonth", "thisYear"]}
 *   startLabel="From"
 *   endLabel="To"
 * />
 * ```
 */
import { injectCSS } from "../../inject.ts";
import { useLabels, type LocaleStrings } from "../../locale.ts";

/** @internal CSS for DateRangePicker — co-located for self-containment. */
const DATE_RANGE_PICKER_CSS = `/* --- DateRangePicker --- */
.ii-date-range {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-2);
}
.ii-date-range__fields {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  flex-wrap: wrap;
}
.ii-date-range__field {
  display: flex;
  flex-direction: column;
  gap: var(--ii-spacing-1);
  flex: 1;
  min-width: 140px;
}
.ii-date-range__label {
  font-size: var(--ii-font-sm);
  font-weight: 500;
  color: var(--ii-on-surface-variant);
}
.ii-date-range__input {
  min-height: 40px;
  padding: 10px 12px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  transition: border-color var(--ii-transition);
}
.ii-date-range__input:hover {
  border-color: var(--ii-outline);
}
.ii-date-range__input:focus {
  outline: 2px solid var(--ii-primary);
  outline-offset: 2px;
  border-color: var(--ii-primary);
}
.ii-date-range__separator {
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-base);
  padding-top: 20px;
  flex-shrink: 0;
}
.ii-date-range__presets {
  display: flex;
  gap: var(--ii-spacing-1);
  flex-wrap: wrap;
}
.ii-date-range__preset {
  padding: 4px 12px;
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-full);
  background: var(--ii-surface);
  color: var(--ii-on-surface);
  font-family: inherit;
  font-size: var(--ii-font-sm);
  cursor: pointer;
  transition: all var(--ii-transition);
  white-space: nowrap;
}
.ii-date-range__preset:hover {
  background: var(--ii-surface-container);
  border-color: var(--ii-outline);
}
.ii-date-range__preset--active {
  background: var(--ii-primary-container);
  color: var(--ii-on-primary-container);
  border-color: var(--ii-primary);
}
`;

/** Available date range presets. */
export type DateRangePreset =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear";

/** Locale label keys used by DateRangePicker. */
type DateRangeLocaleKey =
  | "drpFrom"
  | "drpTo"
  | "drpToday"
  | "drpYesterday"
  | "drpThisWeek"
  | "drpLastWeek"
  | "drpThisMonth"
  | "drpLastMonth"
  | "drpThisYear";

/** Fallback labels (not registered in global locale to avoid bloat). */
const FALLBACK_EN: Record<DateRangeLocaleKey, string> = {
  drpFrom: "From",
  drpTo: "To",
  drpToday: "Today",
  drpYesterday: "Yesterday",
  drpThisWeek: "This week",
  drpLastWeek: "Last week",
  drpThisMonth: "This month",
  drpLastMonth: "Last month",
  drpThisYear: "This year",
};

const FALLBACK_JA: Record<DateRangeLocaleKey, string> = {
  drpFrom: "開始日",
  drpTo: "終了日",
  drpToday: "今日",
  drpYesterday: "昨日",
  drpThisWeek: "今週",
  drpLastWeek: "先週",
  drpThisMonth: "今月",
  drpLastMonth: "先月",
  drpThisYear: "今年",
};

/** Props for the {@link DateRangePicker} component. */
export interface DateRangePickerProps {
  /** Start date in YYYY-MM-DD format. */
  startDate: string;
  /** End date in YYYY-MM-DD format. */
  endDate: string;
  /** Callback when either date changes. */
  onChange: (startDate: string, endDate: string) => void;
  /** Custom start label. */
  startLabel?: string;
  /** Custom end label. */
  endLabel?: string;
  /** Preset buttons to show. */
  presets?: DateRangePreset[];
  /** Minimum selectable date (YYYY-MM-DD). */
  min?: string;
  /** Maximum selectable date (YYYY-MM-DD). */
  max?: string;
  /** Whether the picker is disabled. */
  disabled?: boolean;
  /** Locale label overrides. */
  labels?: Partial<Record<DateRangeLocaleKey, string>>;
  /** Additional CSS class. */
  class?: string;
}

/** Format a Date to YYYY-MM-DD. */
function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Compute start and end dates for a preset. */
function resolvePreset(preset: DateRangePreset): [string, string] {
  const now = new Date();
  const today = fmt(now);
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  switch (preset) {
    case "today":
      return [today, today];
    case "yesterday": {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      return [fmt(d), fmt(d)];
    }
    case "thisWeek": {
      const start = new Date(now);
      start.setDate(start.getDate() - mondayOffset);
      return [fmt(start), today];
    }
    case "lastWeek": {
      const start = new Date(now);
      start.setDate(start.getDate() - mondayOffset - 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return [fmt(start), fmt(end)];
    }
    case "thisMonth": {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return [fmt(start), today];
    }
    case "lastMonth": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return [fmt(start), fmt(end)];
    }
    case "thisYear": {
      const start = new Date(now.getFullYear(), 0, 1);
      return [fmt(start), today];
    }
  }
}

/**
 * Date range picker with native date inputs and optional presets.
 *
 * Uses `<input type="date">` for zero-dependency date selection.
 * Presets allow quick selection of common ranges like "This week" or "This month".
 */
export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  startLabel,
  endLabel,
  presets,
  min,
  max,
  disabled,
  labels: labelOverrides,
  class: cls,
}: DateRangePickerProps): any {
  injectCSS("ii-date-range", DATE_RANGE_PICKER_CSS);

  // Detect locale for fallback labels
  const lang =
    typeof document !== "undefined"
      ? document.documentElement.lang
      : "en";
  const fallback = lang === "ja" ? FALLBACK_JA : FALLBACK_EN;
  const l = { ...fallback, ...labelOverrides };

  const presetLabelMap: Record<DateRangePreset, string> = {
    today: l.drpToday,
    yesterday: l.drpYesterday,
    thisWeek: l.drpThisWeek,
    lastWeek: l.drpLastWeek,
    thisMonth: l.drpThisMonth,
    lastMonth: l.drpLastMonth,
    thisYear: l.drpThisYear,
  };

  /** Check if a preset matches the current selection. */
  function isPresetActive(preset: DateRangePreset): boolean {
    const [s, e] = resolvePreset(preset);
    return startDate === s && endDate === e;
  }

  return (
    <div class={`ii-date-range${cls ? ` ${cls}` : ""}`}>
      <div class="ii-date-range__fields">
        <div class="ii-date-range__field">
          <label class="ii-date-range__label">
            {startLabel ?? l.drpFrom}
          </label>
          <input
            type="date"
            class="ii-date-range__input"
            value={startDate}
            min={min}
            max={endDate || max}
            disabled={disabled}
            onInput={(e: Event) =>
              onChange((e.target as HTMLInputElement).value, endDate)
            }
          />
        </div>
        <span class="ii-date-range__separator">—</span>
        <div class="ii-date-range__field">
          <label class="ii-date-range__label">
            {endLabel ?? l.drpTo}
          </label>
          <input
            type="date"
            class="ii-date-range__input"
            value={endDate}
            min={startDate || min}
            max={max}
            disabled={disabled}
            onInput={(e: Event) =>
              onChange(startDate, (e.target as HTMLInputElement).value)
            }
          />
        </div>
      </div>

      {presets && presets.length > 0 && (
        <div class="ii-date-range__presets">
          {presets.map((preset) => (
            <button
              type="button"
              class={`ii-date-range__preset${
                isPresetActive(preset) ? " ii-date-range__preset--active" : ""
              }`}
              disabled={disabled}
              onClick={() => {
                const [s, e] = resolvePreset(preset);
                onChange(s, e);
              }}
            >
              {presetLabelMap[preset]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
