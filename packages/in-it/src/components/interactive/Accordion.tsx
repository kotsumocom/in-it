/**
 * Accordion 繧ｳ繝ｳ繝昴・繝阪Φ繝茨ｼ・ono/jsx/dom・・ * WAI-ARIA Accordion 繝代ち繝ｼ繝ｳ貅匁侠
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
  /** 隍・焚繝代ロ繝ｫ繧貞酔譎ゅ↓髢九￠繧九° */
  multiple?: boolean;
  /** 蛻晄悄螻暮幕 */
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
    <div class="ii-accordion">
      {items.map((item) => {
        const isOpen = expanded.has(item.value);
        const enabledIdx = enabledItems.findIndex((e) => e.value === item.value);
        return (
          <div key={item.value} class={`ii-accordion__item${isOpen ? " ii-accordion__item--open" : ""}`}>
            <button
              type="button"
              id={`accordion-header-${item.value}`}
              class="ii-accordion__header"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.value}`}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              onClick={() => !item.disabled && toggle(item.value)}
              onKeyDown={(e: KeyboardEvent) => handleKeyDown(e, enabledIdx)}
            >
              <span class="ii-accordion__title">{item.title}</span>
              <span class={`ii-accordion__chevron${isOpen ? " ii-accordion__chevron--open" : ""}`}>
                笆ｼ
              </span>
            </button>
            <div
              id={`accordion-panel-${item.value}`}
              role="region"
              aria-labelledby={`accordion-header-${item.value}`}
              class={`ii-accordion__panel${isOpen ? " ii-accordion__panel--open" : ""}`}
              hidden={!isOpen}
            >
              <div class="ii-accordion__content">{item.children}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

