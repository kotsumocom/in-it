/**
 * ContextSwitcher - Breadcrumb-style hierarchical context switcher.
 *
 * Displays a breadcrumb-like row of selectable context levels.
 * Each level shows the currently selected item and opens a
 * dropdown (Menu-style) to switch between available items.
 *
 * Uses Menu component internally for dropdown behavior.
 *
 * Future: ContextSearch will provide a Combobox-based variant
 * for use cases with many items requiring search.
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for ContextSwitcher — co-located for self-containment. */
export const CONTEXT_SWITCHER_CSS = `/* --- ContextSwitcher --- */
.ii-context-switcher {
  display: flex;
  align-items: center;
  gap: 0;
  min-width: 0;
}
.ii-context-switcher__level {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.ii-context-switcher__trigger {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-1);
  padding: var(--ii-spacing-1) var(--ii-spacing-2);
  border: none;
  background: none;
  font-family: inherit;
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface);
  cursor: pointer;
  border-radius: var(--ii-shape-sm);
  white-space: nowrap;
  transition: background var(--ii-transition);
}
.ii-context-switcher__trigger:hover {
  background: var(--ii-surface-container-high);
}
.ii-context-switcher__trigger-icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ii-context-switcher__chevron {
  width: 14px;
  height: 14px;
  opacity: 0.5;
  flex-shrink: 0;
  transition: transform 150ms ease;
}
.ii-context-switcher__chevron--open {
  transform: rotate(180deg);
}
.ii-context-switcher__separator {
  color: var(--ii-on-surface-variant);
  opacity: 0.4;
  padding: 0 var(--ii-spacing-1);
  user-select: none;
  font-size: var(--ii-font-lg);
}
.ii-context-switcher__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md);
  min-width: 180px;
  max-width: 280px;
  padding: 4px;
  z-index: 50;
  animation: ii-fade-in 100ms ease;
}
.ii-context-switcher__option {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  width: 100%;
  padding: 8px 12px;
  font-family: inherit;
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface);
  background: none;
  border: none;
  border-radius: var(--ii-shape-sm);
  cursor: pointer;
  text-align: left;
}
.ii-context-switcher__option:hover {
  background: var(--ii-surface-container-high);
}
.ii-context-switcher__option--active {
  background: var(--ii-primary-container);
  color: var(--ii-on-primary-container);
  font-weight: 500;
}
.ii-context-switcher__option-icon {
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
`;

/** A selectable item within a context level. */
export interface ContextItem {
  /** Unique identifier for this item. */
  key: string;
  /** Display label. */
  label: string;
  /** Optional icon (string icon name or JSX). */
  icon?: string | any;
}

/** One level of the context hierarchy. */
export interface ContextLevel {
  /** Currently selected item at this level. */
  selected: ContextItem;
  /** All available items to switch between. */
  items: ContextItem[];
  /** Optional label for this level (e.g., "Organization"). */
  label?: string;
}

/** Props for the ContextSwitcher component. */
export interface ContextSwitcherProps {
  /** Array of context levels, ordered from top to bottom of the hierarchy. */
  levels: ContextLevel[];
  /** Called when the user switches context at any level. */
  onSwitch?: (levelIndex: number, item: ContextItem) => void;
  /** Separator between levels. Default: "/" */
  separator?: string | any;
}

/** Chevron-down SVG icon for dropdown triggers. */
function ChevronDown({ open }: { open: boolean }): any {
  return (
    <svg
      class={`ii-context-switcher__chevron${open ? " ii-context-switcher__chevron--open" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** A single level trigger + dropdown. */
function ContextLevelView({
  level,
  levelIndex,
  onSwitch,
}: {
  level: ContextLevel;
  levelIndex: number;
  onSwitch?: (levelIndex: number, item: ContextItem) => void;
}): any {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = useCallback(
    (item: ContextItem) => {
      setOpen(false);
      if (item.key !== level.selected.key) {
        onSwitch?.(levelIndex, item);
      }
    },
    [level.selected.key, levelIndex, onSwitch],
  );

  // Single item — no dropdown needed
  if (level.items.length <= 1) {
    return (
      <div class="ii-context-switcher__level">
        <span class="ii-context-switcher__trigger" style="cursor: default;">
          {level.selected.icon && (
            <span class="ii-context-switcher__trigger-icon">
              {level.selected.icon}
            </span>
          )}
          {level.selected.label}
        </span>
      </div>
    );
  }

  return (
    <div class="ii-context-switcher__level" ref={ref}>
      <button
        class="ii-context-switcher__trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={level.label ? `${level.label}: ${level.selected.label}` : level.selected.label}
      >
        {level.selected.icon && (
          <span class="ii-context-switcher__trigger-icon">
            {level.selected.icon}
          </span>
        )}
        {level.selected.label}
        <ChevronDown open={open} />
      </button>

      {open && (
        <div class="ii-context-switcher__dropdown" role="listbox">
          {level.items.map((item) => (
            <button
              key={item.key}
              class={`ii-context-switcher__option${item.key === level.selected.key ? " ii-context-switcher__option--active" : ""}`}
              role="option"
              aria-selected={item.key === level.selected.key}
              onClick={() => handleSelect(item)}
            >
              {item.icon && (
                <span class="ii-context-switcher__option-icon">
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Breadcrumb-style hierarchical context switcher with dropdown selection. */
export function ContextSwitcher({
  levels,
  onSwitch,
  separator = "/",
}: ContextSwitcherProps): any {
  injectCSS("ii-context-switcher", CONTEXT_SWITCHER_CSS);

  return (
    <div class="ii-context-switcher">
      {levels.map((level, i) => (
        <>
          {i > 0 && (
            <span class="ii-context-switcher__separator">{separator}</span>
          )}
          <ContextLevelView
            level={level}
            levelIndex={i}
            onSwitch={onSwitch}
          />
        </>
      ))}
    </div>
  );
}
