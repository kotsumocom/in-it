/**
 * Accordion component (hono/jsx/dom)
 * WAI-ARIA Accordion pattern
 */
import { useState, useCallback } from "hono/jsx";
import { Icon } from "../../icons/Icon.tsx";
import { ACCORDION_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";

/** Definition of a single accordion item for the component. */
export interface AccordionItemDef {
  id: string;
  title: string;
  content: any;
  disabled?: boolean;
}

/** Props for the Accordion component. */
export interface AccordionProps {
  items: AccordionItemDef[];
  multiple?: boolean;
  defaultOpen?: string[];
}

/** Expandable/collapsible content panels with WAI-ARIA support. */
export function Accordion({ items, multiple = false, defaultOpen = [] }: AccordionProps): any {
  injectCSS("ii-accordion", ACCORDION_CSS);
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
              <span class={`ii-accordion__icon${isOpen ? " ii-accordion__icon--open" : ""}`}><Icon name="chevron-down" size={18} /></span>
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