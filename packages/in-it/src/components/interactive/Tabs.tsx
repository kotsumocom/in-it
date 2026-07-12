/**
 * Tabs コンポーネント（hono/jsx/dom）
 * WAI-ARIA Tabs パターン準拠
 */
import { useState, useCallback } from "hono/jsx";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  /** タブ項目 */
  items: TabItem[];
  /** 初期アクティブ */
  defaultValue?: string;
  /** 変更コールバック */
  onChange?: (value: string) => void;
  /** 各パネルのコンテンツ */
  children: any;
}

export function Tabs({ items, defaultValue, onChange, children }: TabsProps) {
  const [active, setActive] = useState(defaultValue ?? items[0]?.value ?? "");

  const handleSelect = useCallback(
    (value: string) => {
      setActive(value);
      onChange?.(value);
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, index: number) => {
      const enabledItems = items.filter((i) => !i.disabled);
      const currentIdx = enabledItems.findIndex((i) => i.value === items[index].value);

      let nextIdx = currentIdx;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextIdx = (currentIdx + 1) % enabledItems.length;
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        nextIdx = (currentIdx - 1 + enabledItems.length) % enabledItems.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIdx = enabledItems.length - 1;
      } else {
        return;
      }
      handleSelect(enabledItems[nextIdx].value);
    },
    [items, handleSelect],
  );

  // children を配列化して active に対応するものだけ表示
  const panels = Array.isArray(children) ? children : [children];

  return (
    <div class="sc-tabs">
      <div class="sc-tabs__list" role="tablist">
        {items.map((item, i) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            class={`sc-tabs__tab${active === item.value ? " sc-tabs__tab--active" : ""}`}
            aria-selected={active === item.value}
            aria-disabled={item.disabled || undefined}
            tabIndex={active === item.value ? 0 : -1}
            disabled={item.disabled}
            onClick={() => !item.disabled && handleSelect(item.value)}
            onKeyDown={(e: KeyboardEvent) => handleKeyDown(e, i)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div class="sc-tabs__panels">
        {panels.map((panel: any, i: number) => (
          <div
            key={items[i]?.value ?? i}
            role="tabpanel"
            class="sc-tabs__panel"
            hidden={items[i]?.value !== active}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}
