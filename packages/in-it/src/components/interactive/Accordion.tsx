/**
 * Accordion component (hono/jsx/dom)
 * WAI-ARIA Accordion pattern
 */
import { useState, useCallback } from "hono/jsx";

/** AccordionItemDef interface */
export interface AccordionItemDef {
  id: string;
  title: string;
  content: any;
  disabled?: boolean;
}

/** AccordionProps interface */
export interface AccordionProps {
  items: AccordionItemDef[];
  multiple?: boolean;
  defaultOpen?: string[];
}

/** Accordion */
export function Accordion({ items, multiple = false, defaultOpen = [] }: AccordionProps): any {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpen));

  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  }, [multiple]);

  return (
    <div class="ii-accordion">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} class={`ii-accordion__item${isOpen ? " ii-accordion__item--open" : ""}`}>
            <button
              type="button"
              class="ii-accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
              id={`accordion-header-${item.id}`}
              disabled={item.disabled}
              onClick={() => { if (!item.disabled) toggle(item.id); }}
            >
              <span class="ii-accordion__title">{item.title}</span>
              <span class="ii-accordion__icon">{isOpen ? "-" : "+"}</span>
            </button>
            {isOpen && (
              <div
                class="ii-accordion__panel"
                role="region"
                id={`accordion-panel-${item.id}`}
                aria-labelledby={`accordion-header-${item.id}`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}