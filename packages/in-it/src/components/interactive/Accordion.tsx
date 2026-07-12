/**
 * Accordion コンポーネント（hono/jsx/dom）
 * WAI-ARIA Accordion パターン準拠
 */
import { useState, useCallback } from "hono/jsx";

export interface AccordionItemDef {
  value: string;
  title: string;
  disabled?: boolean;
  children: any;
}

export interface AccordionProps {
  items: AccordionItemDef[];
  /** 複数パネルを同時に開けるか */
  multiple?: boolean;
  /** 初期展開 */
  defaultExpanded?: string[];
}

export function Accordion({ items, multiple = false, defaultExpanded = [] }: AccordionProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));

  const toggle = useCallback(
    (value: string) => {
      setExpanded((prev) => {
        const next = new Set(prev);
        if (next.has(value)) {
          next.delete(value);
        } else {
          if (!multiple) next.clear();
          next.add(value);
        }
        return next;
      });
    },
    [multiple],
  );

  const enabledItems = items.filter((i) => !i.disabled);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      let nextIdx = -1;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          nextIdx = (index + 1) % enabledItems.length;
          break;
        case "ArrowUp":
          e.preventDefault();
          nextIdx = (index - 1 + enabledItems.length) % enabledItems.length;
          break;
        case "Home":
          e.preventDefault();
          nextIdx = 0;
          break;
        case "End":
          e.preventDefault();
          nextIdx = enabledItems.length - 1;
          break;
      }
      if (nextIdx >= 0) {
        const el = document.getElementById(`accordion-header-${enabledItems[nextIdx].value}`);
        el?.focus();
      }
    },
    [enabledItems],
  );

  return (
    <div class="sc-accordion">
      {items.map((item) => {
        const isOpen = expanded.has(item.value);
        const enabledIdx = enabledItems.findIndex((e) => e.value === item.value);
        return (
          <div key={item.value} class={`sc-accordion__item${isOpen ? " sc-accordion__item--open" : ""}`}>
            <button
              type="button"
              id={`accordion-header-${item.value}`}
              class="sc-accordion__header"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.value}`}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              onClick={() => !item.disabled && toggle(item.value)}
              onKeyDown={(e: KeyboardEvent) => handleKeyDown(e, enabledIdx)}
            >
              <span class="sc-accordion__title">{item.title}</span>
              <span class={`sc-accordion__chevron${isOpen ? " sc-accordion__chevron--open" : ""}`}>
                ▼
              </span>
            </button>
            <div
              id={`accordion-panel-${item.value}`}
              role="region"
              aria-labelledby={`accordion-header-${item.value}`}
              class={`sc-accordion__panel${isOpen ? " sc-accordion__panel--open" : ""}`}
              hidden={!isOpen}
            >
              <div class="sc-accordion__content">{item.children}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
