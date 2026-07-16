
import { injectCSS } from "../../inject.ts";

/** @internal CSS for ValidationSummary. Reuses Alert color tokens. */
const VALIDATION_SUMMARY_CSS = `/* --- ValidationSummary --- */
.ii-validation-summary {
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  background: var(--ii-surface-container-low);
  overflow: hidden;
}
.ii-validation-summary__title {
  padding: var(--ii-spacing-3) var(--ii-spacing-4);
  font-weight: 600;
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface);
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-validation-summary__group {
  padding: var(--ii-spacing-2) var(--ii-spacing-4);
}
.ii-validation-summary__group + .ii-validation-summary__group {
  border-top: 1px solid var(--ii-outline-variant);
}
.ii-validation-summary__group-header {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  font-size: var(--ii-font-sm);
  font-weight: 600;
  margin-bottom: var(--ii-spacing-1);
}
.ii-validation-summary__group-header--error { color: var(--ii-error); }
.ii-validation-summary__group-header--warning { color: var(--ii-warning); }
.ii-validation-summary__group-header--info { color: var(--ii-info); }
.ii-validation-summary__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.ii-validation-summary__item {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  padding: var(--ii-spacing-1) 0;
  padding-left: var(--ii-spacing-4);
  position: relative;
}
.ii-validation-summary__item::before {
  content: '•';
  position: absolute;
  left: var(--ii-spacing-1);
  color: inherit;
}
.ii-validation-summary__empty {
  display: none;
}
`;

/** Severity icon mapping. */
const SEVERITY_ICONS: Record<string, string> = {
  error: "🔴",
  warning: "🟠",
  info: "🔵",
};

/** Severity display labels. */
const SEVERITY_LABELS: Record<string, Record<string, string>> = {
  en: { error: "Errors", warning: "Warnings", info: "Info" },
  ja: { error: "エラー", warning: "警告", info: "情報" },
};

/** A single validation message. */
export interface ValidationItem {
  /** Optional rule ID (e.g. "V001"). */
  id?: string;
  /** Validation message text. */
  message: string;
  /** Severity level. */
  severity: "error" | "warning" | "info";
  /** Optional field name for future scroll-to-field support. */
  field?: string;
}

/**
 * Props for the {@link ValidationSummary} component.
 * @property items - Array of validation messages. Empty array = render nothing.
 * @property title - Optional title. Defaults to "Validation Results".
 * @property groupBySeverity - Group messages by severity. Default: true.
 * @property class - Additional CSS class.
 */
export interface ValidationSummaryProps {
  items: ValidationItem[];
  title?: string;
  groupBySeverity?: boolean;
  class?: string;
}

/**
 * Grouped validation message display.
 *
 * Renders validation errors, warnings, and info messages
 * grouped by severity. Renders nothing when items is empty.
 *
 * Uses Alert's color tokens (via CSS variables) for consistent
 * severity color-coding.
 *
 * @example
 * ```tsx
 * <ValidationSummary items={[
 *   { id: "V001", message: "5万円超の支出には住所が必要です", severity: "warning" },
 *   { id: "V006", message: "証憑を添付できない理由を入力してください", severity: "error" },
 * ]} />
 * ```
 */
export function ValidationSummary({
  items,
  title,
  groupBySeverity = true,
  class: cls,
}: ValidationSummaryProps): any {
  if (items.length === 0) return null;

  injectCSS("ii-validation-summary", VALIDATION_SUMMARY_CSS);

  // Detect locale from document lang attribute
  const lang = typeof document !== "undefined"
    ? (document.documentElement.getAttribute("lang") ?? "en")
    : "en";
  const labels = SEVERITY_LABELS[lang] ?? SEVERITY_LABELS.en;

  const displayTitle = title ?? (lang === "ja" ? "検証結果" : "Validation Results");

  if (!groupBySeverity) {
    return (
      <div class={`ii-validation-summary${cls ? ` ${cls}` : ""}`}>
        <div class="ii-validation-summary__title">{displayTitle}</div>
        <div class="ii-validation-summary__group">
          <ul class="ii-validation-summary__list">
            {items.map((item, i) => (
              <li class="ii-validation-summary__item" key={i}>
                {item.id ? `[${item.id}] ` : ""}{item.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Group by severity in priority order
  const order: Array<"error" | "warning" | "info"> = ["error", "warning", "info"];
  const groups = new Map<string, ValidationItem[]>();
  for (const item of items) {
    const list = groups.get(item.severity) ?? [];
    list.push(item);
    groups.set(item.severity, list);
  }

  return (
    <div class={`ii-validation-summary${cls ? ` ${cls}` : ""}`}>
      <div class="ii-validation-summary__title">{displayTitle}</div>
      {order
        .filter((s) => groups.has(s))
        .map((severity) => {
          const groupItems = groups.get(severity)!;
          return (
            <div class="ii-validation-summary__group" key={severity}>
              <div class={`ii-validation-summary__group-header ii-validation-summary__group-header--${severity}`}>
                <span>{SEVERITY_ICONS[severity]}</span>
                <span>{labels[severity]} ({groupItems.length})</span>
              </div>
              <ul class="ii-validation-summary__list">
                {groupItems.map((item, i) => (
                  <li class="ii-validation-summary__item" key={i}>
                    {item.id ? `[${item.id}] ` : ""}{item.message}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
    </div>
  );
}
