/**
 * Tabs 繧ｳ繝ｳ繝昴・繝阪Φ繝茨ｼ・ono/jsx/dom・・ * WAI-ARIA Tabs 繝代ち繝ｼ繝ｳ貅匁侠
 */
import { useState, useCallback } from "hono/jsx";

export interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  /** 繧ｿ繝夜・岼 */
  items: TabItem[];
  /** 蛻晄悄繧｢繧ｯ繝・ぅ繝・*/
  defaultValue?: string;
  /** 螟画峩繧ｳ繝ｼ繝ｫ繝舌ャ繧ｯ */
  onChange?: (value: string) => void;
  /** 蜷・ヱ繝阪Ν縺ｮ繧ｳ繝ｳ繝・Φ繝・*/
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

  // children 繧帝・蛻怜喧縺励※ active 縺ｫ蟇ｾ蠢懊☆繧九ｂ縺ｮ縺縺題｡ｨ遉ｺ
  const panels = Array.isArray(children) ? children : [children];

  return (
    <div class="ii-tabs">
      <div class="ii-tabs__list" role="tablist">
        {items.map((item, i) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            class={`ii-tabs__tab${active === item.value ? " ii-tabs__tab--active" : ""}`}
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
      <div class="ii-tabs__panels">
        {panels.map((panel: any, i: number) => (
          <div
            key={items[i]?.value ?? i}
            role="tabpanel"
            class="ii-tabs__panel"
            hidden={items[i]?.value !== active}
          >
            {panel}
          </div>
        ))}
      </div>
    </div>
  );
}

