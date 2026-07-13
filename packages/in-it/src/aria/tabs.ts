/**
 * WAI-ARIA Tabs pattern
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Roving tabindex + Arrow key navigation.
 */

/** Represents a single tab with its value and optional disabled state. */
export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/** API returned by {@link createTabs} for managing tabbed interface state and ARIA props. */
export interface TabsApi {
  /** Props to apply to the tablist container */
  listProps: {
    role: "tablist";
    "aria-orientation": "horizontal" | "vertical";
  };
  /** Get props for each tab */
  getTabProps: (value: string) => {
    role: "tab";
    id: string;
    "aria-selected": boolean;
    "aria-controls": string;
    "aria-disabled"?: boolean;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** Get props for each panel */
  getPanelProps: (value: string) => {
    role: "tabpanel";
    id: string;
    "aria-labelledby": string;
    tabIndex: 0;
    hidden: boolean;
  };
  /** Active tab */
  activeTab: string;
  /** Select a tab */
  select: (value: string) => void;
}

/** Configuration options for creating a tabs instance. */
export interface CreateTabsOptions {
  /** Tab items */
  items: TabItem[];
  /** Initially active tab */
  defaultValue?: string;
  /** Change callback */
  onChange?: (value: string) => void;
  /** Layout direction; controls whether Arrow Left/Right or Arrow Up/Down navigates tabs */
  orientation?: "horizontal" | "vertical";
  /** ID prefix */
  id?: string;
}

let tabsCounter = 0;

/** Creates a WAI-ARIA compliant tabbed interface with keyboard navigation. */
export function createTabs(options: CreateTabsOptions): TabsApi {
  const prefix = options.id ?? `tabs-${++tabsCounter}`;
  const orientation = options.orientation ?? "horizontal";
  const items = options.items;
  let activeTab = options.defaultValue ?? items[0]?.value ?? "";

  function select(value: string) {
    const item = items.find((i) => i.value === value);
    if (item && !item.disabled) {
      activeTab = value;
      options.onChange?.(value);
    }
  }

  function getEnabledItems(): TabItem[] {
    return items.filter((i) => !i.disabled);
  }

  function navigateTab(currentValue: string, direction: 1 | -1) {
    const enabled = getEnabledItems();
    const idx = enabled.findIndex((i) => i.value === currentValue);
    if (idx === -1) return;
    const next = (idx + direction + enabled.length) % enabled.length;
    select(enabled[next].value);
  }

  function handleKeyDown(currentValue: string) {
    return (e: KeyboardEvent) => {
      const isHorizontal = orientation === "horizontal";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

      if (e.key === prevKey) {
        e.preventDefault();
        navigateTab(currentValue, -1);
      } else if (e.key === nextKey) {
        e.preventDefault();
        navigateTab(currentValue, 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        const enabled = getEnabledItems();
        if (enabled.length) select(enabled[0].value);
      } else if (e.key === "End") {
        e.preventDefault();
        const enabled = getEnabledItems();
        if (enabled.length) select(enabled[enabled.length - 1].value);
      }
    };
  }

  return {
    listProps: {
      role: "tablist" as const,
      "aria-orientation": orientation,
    },
    getTabProps: (value: string) => {
      const item = items.find((i) => i.value === value);
      const isSelected = value === activeTab;
      return {
        role: "tab" as const,
        id: `${prefix}-tab-${value}`,
        "aria-selected": isSelected,
        "aria-controls": `${prefix}-panel-${value}`,
        "aria-disabled": item?.disabled || undefined,
        tabIndex: isSelected ? 0 : -1,
        onClick: () => select(value),
        onKeyDown: handleKeyDown(value),
      };
    },
    getPanelProps: (value: string) => ({
      role: "tabpanel" as const,
      id: `${prefix}-panel-${value}`,
      "aria-labelledby": `${prefix}-tab-${value}`,
      tabIndex: 0 as const,
      hidden: value !== activeTab,
    }),
    activeTab,
    select,
  };
}