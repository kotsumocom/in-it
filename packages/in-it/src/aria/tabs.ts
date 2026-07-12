/**
 * WAI-ARIA Tabs パターン
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * Roving tabindex + Arrow キーナビゲーション。
 */

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsApi {
  /** tablist コンテナに適用する props */
  listProps: {
    role: "tablist";
    "aria-orientation": "horizontal" | "vertical";
  };
  /** 各タブに適用する props を取得 */
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
  /** 各パネルに適用する props を取得 */
  getPanelProps: (value: string) => {
    role: "tabpanel";
    id: string;
    "aria-labelledby": string;
    tabIndex: 0;
    hidden: boolean;
  };
  /** アクティブなタブ */
  activeTab: string;
  /** タブを選択 */
  select: (value: string) => void;
}

export interface CreateTabsOptions {
  /** タブ項目 */
  items: TabItem[];
  /** 初期アクティブ */
  defaultValue?: string;
  /** 変更コールバック */
  onChange?: (value: string) => void;
  /** 向き */
  orientation?: "horizontal" | "vertical";
  /** ID プレフィックス */
  id?: string;
}

let tabsCounter = 0;

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
