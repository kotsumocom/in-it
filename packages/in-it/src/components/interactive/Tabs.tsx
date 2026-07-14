/**
 * Tabs component (hono/jsx/dom)
 * WAI-ARIA Tabs pattern
 */
import { useState, useCallback, useRef } from "hono/jsx";
import { TABS_CSS } from "../../css.ts";
import { injectCSS } from "../../inject.ts";

/** A single tab panel definition. */
export interface TabItem {
  id: string;
  label: string;
  content: any;
  disabled?: boolean;
}

/** Props for the Tabs component. */
export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (id: string) => void;
}

/** Tabbed interface with keyboard navigation and ARIA tabs pattern. */
export function Tabs({ items, defaultTab, onChange }: TabsProps): any {
  injectCSS("ii-tabs", TABS_CSS);
  const [activeId, setActiveId] = useState(defaultTab ?? items[0]?.id ?? "");
  const tabListRef = useRef<HTMLDivElement>(null);

  const enabledItems = items.filter((t) => !t.disabled);

  const activate = useCallback((id: string) => {
    setActiveId(id);
    onChange?.(id);
  }, [onChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentIdx = enabledItems.findIndex((t) => t.id === activeId);
    let nextIdx = currentIdx;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        nextIdx = (currentIdx + 1) % enabledItems.length;
        break;
      case "ArrowLeft":
        e.preventDefault();
        nextIdx = (currentIdx - 1 + enabledItems.length) % enabledItems.length;
        break;
      case "Home":
        e.preventDefault();
        nextIdx = 0;
        break;
      case "End":
        e.preventDefault();
        nextIdx = enabledItems.length - 1;
        break;
      default:
        return;
    }

    activate(enabledItems[nextIdx].id);
  }, [activeId, enabledItems, activate]);

  const activeItem = items.find((t) => t.id === activeId);

  return (
    <div class="ii-tabs">
      <div class="ii-tabs__list" role="tablist" ref={tabListRef} onKeyDown={handleKeyDown}>
        {items.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={tab.id === activeId}
            aria-controls={`panel-${tab.id}`}
            aria-disabled={tab.disabled}
            class={`ii-tabs__tab${tab.id === activeId ? " ii-tabs__tab--active" : ""}${tab.disabled ? " ii-tabs__tab--disabled" : ""}`}
            tabIndex={tab.id === activeId ? 0 : -1}
            onClick={() => { if (!tab.disabled) activate(tab.id); }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div
          class="ii-tabs__panel"
          role="tabpanel"
          id={`panel-${activeItem.id}`}
          aria-labelledby={`tab-${activeItem.id}`}
          tabIndex={0}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}