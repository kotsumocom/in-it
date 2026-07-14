/**
 * Menu component (hono/jsx/dom)
 * WAI-ARIA Menu Button pattern
 */
import { useState, useEffect, useCallback, useRef } from "hono/jsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Menu — co-located for self-containment. */
export const MENU_CSS = `/* --- Menu --- */
.ii-menu {
  position: relative;
  display: inline-block;
}
.ii-menu__trigger {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  padding: var(--ii-spacing-2);
  border-radius: var(--ii-shape-sm);
  color: var(--ii-on-surface-variant);
}
.ii-menu__trigger:hover { background: var(--ii-surface-container-high); }
.ii-menu__dropdown {
  position: absolute;
  top: 100%;
  margin-top: 4px;
  background: var(--ii-surface);
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-md);
  box-shadow: var(--ii-shadow-md);
  min-width: 180px;
  padding: 4px;
  z-index: 50;
  animation: ii-fade-in 100ms ease;
}
.ii-menu__dropdown--left { left: 0; }
.ii-menu__dropdown--right { right: 0; }
.ii-menu__item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  width: 100%;
  min-height: 48px;
  padding: 8px 12px;
  font-family: inherit;
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface);
  background: none;
  border: none;
  border-radius: var(--ii-shape-sm);
  cursor: pointer;
  text-align: left;
}
.ii-menu__item:hover, .ii-menu__item--focused {
  background: var(--ii-surface-container-high);
}
.ii-menu__item--disabled {
  opacity: 0.38;
  cursor: not-allowed;
}
.ii-menu__icon { font-size: 1.1rem; }
.ii-menu__separator {
  height: 1px;
  background: var(--ii-outline-variant);
  margin: 4px 0;
}
`;

/** Definition of a single menu item with optional icon and separator. */
export interface MenuItemDef {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
}

/** Props for the Menu component. */
export interface MenuProps {
  items: MenuItemDef[];
  onSelect?: (id: string) => void;
  trigger: any;
  align?: "left" | "right";
}

/** Dropdown menu button with keyboard navigation and focus management. */
export function Menu({ items, onSelect, trigger, align = "left" }: MenuProps): any {
  injectCSS("ii-menu", MENU_CSS);
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const menuRef = useRef<HTMLDivElement>(null);

  const enabledItems = items.filter((i) => !i.disabled);

  // Close on outside click
  useEffect(() => {
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