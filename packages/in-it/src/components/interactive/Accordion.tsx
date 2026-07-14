/**
 * Accordion component (hono/jsx/dom)
 * WAI-ARIA Accordion pattern
 */
import { useState, useCallback } from "hono/jsx";
import { Icon } from "../../icons/Icon.tsx";

/** @internal CSS for Accordion — co-located for self-containment. */
export const ACCORDION_CSS = `/* --- Accordion --- */
.ii-accordion {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  overflow: hidden;
}
.ii-accordion__item {
  border-bottom: 1px solid var(--ii-outline-variant);
}
.ii-accordion__item:last-child { border-bottom: none; }
.ii-accordion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  background: var(--ii-surface);
  border: none;
  font-family: inherit;
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface);
  cursor: pointer;
  transition: background var(--ii-transition);
}
.ii-accordion__header:hover { background: var(--ii-surface-container-high); }
.ii-accordion__header:focus-visible {
  outline: 2px solid var(--ii-primary);
  outline-offset: -2px;
}
.ii-accordion__header:disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-accordion__chevron {
  font-size: 0.7rem;
  color: var(--ii-on-surface-variant);
  transition: transform 200ms ease;
}
.ii-accordion__chevron--open {
  transform: rotate(180deg);
}
.ii-accordion__panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 200ms ease;
}
.ii-accordion__panel--open {
  max-height: 500px;
}
.ii-accordion__panel[hidden] { display: none; }
.ii-accordion__content {
  padding: 0 16px 16px;
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-base);
  line-height: 1.6;
}
`;

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