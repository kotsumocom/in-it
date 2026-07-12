/**
 * Menu 繧ｳ繝ｳ繝昴・繝阪Φ繝茨ｼ・ono/jsx/dom・・ * WAI-ARIA Menu Button 繝代ち繝ｼ繝ｳ貅匁侠
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";

export interface MenuItemDef {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
}

export interface MenuProps {
  /** 繝｡繝九Η繝ｼ鬆・岼 */
  items: MenuItemDef[];
  /** 鬆・岼驕ｸ謚槭さ繝ｼ繝ｫ繝舌ャ繧ｯ */
  onSelect?: (id: string) => void;
  /** 繝医Μ繧ｬ繝ｼ縺ｮ蜀・ｮｹ */
  trigger: any;
  /** 菴咲ｽｮ */
  align?: "left" | "right";
}

export function Menu({ items, onSelect, trigger, align = "left" }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const enabledItems = items.filter((i) => !i.disabled);

  // 螟門・繧ｯ繝ｪ繝・け縺ｧ髢峨§繧・  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleTriggerClick = useCallback(() => {
    setOpen((v) => {
      if (!v) setFocusedIdx(0);
      return !v;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
          setFocusedIdx(0);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIdx((i) => (i + 1) % enabledItems.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIdx((i) => (i - 1 + enabledItems.length) % enabledItems.length);
          break;
        case "Home":
          e.preventDefault();
          setFocusedIdx(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIdx(enabledItems.length - 1);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIdx >= 0) {
            onSelect?.(enabledItems[focusedIdx].id);
            setOpen(false);
          }
          break;
        case "Escape":
        case "Tab":
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [open, focusedIdx, enabledItems, onSelect],
  );

  return (
    <div class="ii-menu" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        class="ii-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleTriggerClick}
      >
        {trigger}
      </button>

      {open && (
        <div class={`ii-menu__dropdown ii-menu__dropdown--${align}`} role="menu">
          {items.map((item, i) => {
            const enabledIdx = enabledItems.findIndex((e) => e.id === item.id);
            return (
              <div key={item.id}>
                {item.separator && <div class="ii-menu__separator" />}
                <button
                  type="button"
                  role="menuitem"
                  class={`ii-menu__item${enabledIdx === focusedIdx ? " ii-menu__item--focused" : ""}${item.disabled ? " ii-menu__item--disabled" : ""}`}
                  aria-disabled={item.disabled || undefined}
                  tabIndex={enabledIdx === focusedIdx ? 0 : -1}
                  onClick={() => {
                    if (!item.disabled) {
                      onSelect?.(item.id);
                      setOpen(false);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!item.disabled) setFocusedIdx(enabledIdx);
                  }}
                >
                  {item.icon && <span class="ii-menu__icon">{item.icon}</span>}
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

