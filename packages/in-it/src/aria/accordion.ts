/**
 * WAI-ARIA Accordion pattern
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 *
 * Keyboard: Arrow, Home, End, Enter/Space
 */

/** Represents a single item within the accordion. */
export interface AccordionItem {
  value: string;
  disabled?: boolean;
}

/** API returned by {@link createAccordion} for managing accordion state and ARIA props. */
export interface AccordionApi {
  getHeaderProps: (value: string) => {
    id: string;
    role: "button";
    "aria-expanded": boolean;
    "aria-controls": string;
    "aria-disabled"?: boolean;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  getPanelProps: (value: string) => {
    id: string;
    role: "region";
    "aria-labelledby": string;
    hidden: boolean;
  };
  isExpanded: (value: string) => boolean;
  toggle: (value: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

/** Configuration options for creating an accordion instance. */
export interface CreateAccordionOptions {
  items: AccordionItem[];
  /** Allow multiple panels open simultaneously */
  multiple?: boolean;
  /** Initially expanded panels */
  defaultExpanded?: string[];
  /** Change callback */
  onExpandedChange?: (expanded: string[]) => void;
  id?: string;
}

let accordionCounter = 0;

/** Creates a WAI-ARIA compliant accordion with keyboard navigation and ARIA attributes. */
export function createAccordion(opts: CreateAccordionOptions): AccordionApi {
  const prefix = opts.id ?? `accordion-${++accordionCounter}`;
  const items = opts.items;
  const multiple = opts.multiple ?? false;
  let expanded: Set<string> = new Set(opts.defaultExpanded ?? []);
  let focusedValue: string | null = null;

  function getEnabled(): AccordionItem[] {
    return items.filter((i) => !i.disabled);
  }

  function notify() {
    opts.onExpandedChange?.([...expanded]);
  }

  function toggle(value: string) {
    const item = items.find((i) => i.value === value);
    if (!item || item.disabled) return;

    if (expanded.has(value)) {
      expanded.delete(value);
    } else {
      if (!multiple) expanded.clear();
      expanded.add(value);
    }
    notify();
  }

  function expandAll() {
    if (!multiple) return;
    for (const item of getEnabled()) {
      expanded.add(item.value);
    }
    notify();
  }

  function collapseAll() {
    expanded.clear();
    notify();
  }

  function focusHeader(direction: 1 | -1) {
    const enabled = getEnabled();
    if (!enabled.length) return;
    const idx = enabled.findIndex((i) => i.value === focusedValue);
    const next = (idx + direction + enabled.length) % enabled.length;
    focusedValue = enabled[next].value;
  }

  function handleKeyDown(e: KeyboardEvent, value: string) {
    focusedValue = value;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusHeader(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusHeader(-1);
        break;
      case "Home":
        e.preventDefault();
        focusedValue = getEnabled()[0]?.value ?? null;
        break;
      case "End":
        e.preventDefault();
        const en = getEnabled();
        focusedValue = en[en.length - 1]?.value ?? null;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        toggle(value);
        break;
    }
  }

  return {
    getHeaderProps: (value: string) => {
      const item = items.find((i) => i.value === value);
      return {
        id: `${prefix}-header-${value}`,
        role: "button" as const,
        "aria-expanded": expanded.has(value),
        "aria-controls": `${prefix}-panel-${value}`,
        "aria-disabled": item?.disabled || undefined,
        tabIndex: focusedValue === value || (!focusedValue && items[0]?.value === value) ? 0 : -1,
        onClick: () => toggle(value),
        onKeyDown: (e: KeyboardEvent) => handleKeyDown(e, value),
      };
    },
    getPanelProps: (value: string) => ({
      id: `${prefix}-panel-${value}`,
      role: "region" as const,
      "aria-labelledby": `${prefix}-header-${value}`,
      hidden: !expanded.has(value),
    }),
    isExpanded: (value: string) => expanded.has(value),
    toggle,
    expandAll,
    collapseAll,
  };
}