/**
 * WAI-ARIA Menu Button パターン
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 *
 * Arrow, Home, End, Escape
 */

export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  /** 区切り線の後に表示 */
  separator?: boolean;
}

export interface MenuApi {
  /** トリガーボタンに適用する props */
  triggerProps: {
    "aria-haspopup": "menu";
    "aria-expanded": boolean;
    "aria-controls": string;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** メニューコンテナに適用する props */
  menuProps: {
    id: string;
    role: "menu";
    "aria-labelledby": string;
    tabIndex: -1;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  /** 各メニュー項目の props を取得 */
  getItemProps: (id: string) => {
    role: "menuitem";
    id: string;
    tabIndex: number;
    "aria-disabled"?: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
  };
  /** 開いているか */
  isOpen: boolean;
  /** フォーカス中の項目 ID */
  focusedId: string | null;
  /** 開く */
  open: () => void;
  /** 閉じる */
  close: () => void;
  /** トグル */
  toggle: () => void;
}

export interface CreateMenuOptions {
  /** メニュー項目 */
  items: MenuItem[];
  /** 項目選択時コールバック */
  onSelect?: (id: string) => void;
  /** 開閉コールバック */
  onOpenChange?: (open: boolean) => void;
  /** ID プレフィックス */
  id?: string;
}

let menuCounter = 0;

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
