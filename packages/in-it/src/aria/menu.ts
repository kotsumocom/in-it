/**
 * WAI-ARIA Menu Button pattern
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 *
 * Keyboard: Arrow, Home, End, Escape
 */

/** MenuItem interface */
export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  /** Show after separator */
  separator?: boolean;
}

/** MenuApi interface */
export interface MenuApi {
  /** Props to apply to the trigger button */
  triggerProps: {
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    "aria-controls": string;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** Props to apply to the menu container */
  menuProps: {
    id: string;
    role: "menu";
    "aria-labelledby": string;
    tabIndex: -1;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** Get props for each menu item */
  getItemProps: (id: string) => {
    role: "menuitem";
    id: string;
    tabIndex: number;
    "aria-disabled"?: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
  };
  /** Whether the menu is open */
  isOpen: boolean;
  /** Currently focused item ID */
  focusedId: string | null;
  /** Open the menu */
  open: () => void;
  /** Close */
  close: () => void;
  /** Toggle */
  toggle: () => void;
}

/** CreateMenuOptions interface */
export interface CreateMenuOptions {
  /** Menu items */
  items: MenuItem[];
  /** Item selection callback */
  onSelect?: (id: string) => void;
  /** Open/close callback */
  onOpenChange?: (open: boolean) => void;
  /** ID prefix */
  id?: string;
}

let menuCounter = 0;

/** createMenu */
export function createMenu(options: CreateMenuOptions): MenuApi {
  const prefix = options.id ?? `menu-${++menuCounter}`;
  const triggerId = `${prefix}-trigger`;
  const menuId = `${prefix}-list`;
  const items = options.items;
  let isOpen = false;
  let focusedId: string | null = null;

  function getEnabledItems(): MenuItem[] {
    return items.filter((i) => !i.disabled);
  }

  function open() {
    isOpen = true;
    const enabled = getEnabledItems();
    focusedId = enabled[0]?.id ?? null;
    options.onOpenChange?.(true);
  }

  function close() {
    isOpen = false;
    focusedId = null;
    options.onOpenChange?.(false);
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function focusItem(direction: 1 | -1) {
    const enabled = getEnabledItems();
    if (!enabled.length) return;
    const idx = enabled.findIndex((i) => i.id === focusedId);
    const next = (idx + direction + enabled.length) % enabled.length;
    focusedId = enabled[next].id;
  }

  function selectFocused() {
    if (focusedId) {
      const item = items.find((i) => i.id === focusedId);
      if (item && !item.disabled) {
        options.onSelect?.(focusedId);
        close();
      }
    }
  }

  function handleTriggerKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      open();
      const enabled = getEnabledItems();
      focusedId = enabled[enabled.length - 1]?.id ?? null;
    }
  }

  function handleMenuKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusItem(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusItem(-1);
        break;
      case "Home":
        e.preventDefault();
        focusedId = getEnabledItems()[0]?.id ?? null;
        break;
      case "End":
        e.preventDefault();
        const enabled = getEnabledItems();
        focusedId = enabled[enabled.length - 1]?.id ?? null;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectFocused();
        break;
      case "Escape":
      case "Tab":
        e.preventDefault();
        close();
        break;
    }
  }

  return {
    triggerProps: {
      "aria-haspopup": "menu" as const,
      "aria-expanded": isOpen,
      "aria-controls": menuId,
      onClick: toggle,
      onKeyDown: handleTriggerKeyDown,
    },
    menuProps: {
      id: menuId,
      role: "menu" as const,
      "aria-labelledby": triggerId,
      tabIndex: -1,
      onKeyDown: handleMenuKeyDown,
    },
    getItemProps: (id: string) => {
      const item = items.find((i) => i.id === id);
      return {
        role: "menuitem" as const,
        id: `${prefix}-item-${id}`,
        tabIndex: focusedId === id ? 0 : -1,
        "aria-disabled": item?.disabled || undefined,
        onClick: () => {
          if (item && !item.disabled) {
            options.onSelect?.(id);
            close();
          }
        },
        onMouseEnter: () => {
          if (item && !item.disabled) focusedId = id;
        },
      };
    },
    isOpen,
    focusedId,
    open,
    close,
    toggle,
  };
}