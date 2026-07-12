/**
 * WAI-ARIA Listbox pattern (Select)
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 *
 * Keyboard: Arrow, Home, End, Enter, Escape, Type-ahead
 */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectApi {
  triggerProps: {
    role: "combobox";
    "aria-haspopup": "listbox";
    "aria-expanded": boolean;
    "aria-controls": string;
    "aria-activedescendant"?: string;
    tabIndex: 0;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  listboxProps: {
    id: string;
    role: "listbox";
    "aria-labelledby": string;
    tabIndex: -1;
    onKeyDown: (e: KeyboardEvent) => void;
  };
  getOptionProps: (value: string) => {
    id: string;
    role: "option";
    "aria-selected": boolean;
    "aria-disabled"?: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
  };
  isOpen: boolean;
  selectedValue: string | null;
  highlightedValue: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  select: (value: string) => void;
}

export interface CreateSelectOptions {
  options: SelectOption[];
  defaultValue?: string;
  onSelect?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  id?: string;
}

let selectCounter = 0;

export function createSelect(opts: CreateSelectOptions): SelectApi {
  const prefix = opts.id ?? `select-${++selectCounter}`;
  const triggerId = `${prefix}-trigger`;
  const listboxId = `${prefix}-listbox`;
  const options = opts.options;
  let isOpen = false;
  let selectedValue: string | null = opts.defaultValue ?? null;
  let highlightedValue: string | null = null;
  let searchBuffer = "";
  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  function getEnabled(): SelectOption[] {
    return options.filter((o) => !o.disabled);
  }

  function open() {
    isOpen = true;
    highlightedValue = selectedValue ?? getEnabled()[0]?.value ?? null;
    opts.onOpenChange?.(true);
  }

  function close() {
    isOpen = false;
    highlightedValue = null;
    opts.onOpenChange?.(false);
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function select(value: string) {
    const opt = options.find((o) => o.value === value);
    if (opt && !opt.disabled) {
      selectedValue = value;
      opts.onSelect?.(value);
      close();
    }
  }

  function highlight(direction: 1 | -1) {
    const enabled = getEnabled();
    if (!enabled.length) return;
    const idx = enabled.findIndex((o) => o.value === highlightedValue);
    const next = (idx + direction + enabled.length) % enabled.length;
    highlightedValue = enabled[next].value;
  }

  function typeahead(char: string) {
    searchBuffer += char.toLowerCase();
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { searchBuffer = ""; }, 500);

    const match = getEnabled().find((o) =>
      o.label.toLowerCase().startsWith(searchBuffer)
    );
    if (match) highlightedValue = match.value;
  }

  function handleTriggerKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      open();
      const enabled = getEnabled();
      highlightedValue = enabled[enabled.length - 1]?.value ?? null;
    }
  }

  function handleListboxKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        highlight(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        highlight(-1);
        break;
      case "Home":
        e.preventDefault();
        highlightedValue = getEnabled()[0]?.value ?? null;
        break;
      case "End":
        e.preventDefault();
        const en = getEnabled();
        highlightedValue = en[en.length - 1]?.value ?? null;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedValue) select(highlightedValue);
        break;
      case "Escape":
      case "Tab":
        e.preventDefault();
        close();
        break;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          typeahead(e.key);
        }
    }
  }

  return {
    triggerProps: {
      role: "combobox" as const,
      "aria-haspopup": "listbox" as const,
      "aria-expanded": isOpen,
      "aria-controls": listboxId,
      "aria-activedescendant": highlightedValue
        ? `${prefix}-opt-${highlightedValue}`
        : undefined,
      tabIndex: 0,
      onClick: toggle,
      onKeyDown: handleTriggerKeyDown,
    },
    listboxProps: {
      id: listboxId,
      role: "listbox" as const,
      "aria-labelledby": triggerId,
      tabIndex: -1,
      onKeyDown: handleListboxKeyDown,
    },
    getOptionProps: (value: string) => {
      const opt = options.find((o) => o.value === value);
      return {
        id: `${prefix}-opt-${value}`,
        role: "option" as const,
        "aria-selected": selectedValue === value,
        "aria-disabled": opt?.disabled || undefined,
        onClick: () => select(value),
        onMouseEnter: () => {
          if (opt && !opt.disabled) highlightedValue = value;
        },
      };
    },
    isOpen,
    selectedValue,
    highlightedValue,
    open,
    close,
    toggle,
    select,
  };
}
