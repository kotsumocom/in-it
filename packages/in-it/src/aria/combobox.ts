/**
 * WAI-ARIA Combobox pattern
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 *
 * Text input + filterable listbox.
 * Keyboard: Arrow, Home, End, Enter, Escape
 */

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxApi {
  inputProps: {
    role: "combobox";
    "aria-expanded": boolean;
    "aria-controls": string;
    "aria-activedescendant"?: string;
    "aria-autocomplete": "list";
    autoComplete: "off";
    onInput: (e: Event) => void;
    onKeyDown: (e: KeyboardEvent) => void;
    onFocus: () => void;
    onBlur: () => void;
  };
  listboxProps: {
    id: string;
    role: "listbox";
    "aria-label": string;
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
  inputValue: string;
  selectedValue: string | null;
  highlightedValue: string | null;
  filteredOptions: ComboboxOption[];
  open: () => void;
  close: () => void;
  select: (value: string) => void;
  setInputValue: (value: string) => void;
}

export interface CreateComboboxOptions {
  options: ComboboxOption[];
  defaultValue?: string;
  onSelect?: (value: string) => void;
  onInputChange?: (value: string) => void;
  /** Custom filter function */
  filter?: (option: ComboboxOption, query: string) => boolean;
  id?: string;
}

let comboboxCounter = 0;

export function createCombobox(opts: CreateComboboxOptions): ComboboxApi {
  const prefix = opts.id ?? `combobox-${++comboboxCounter}`;
  const listboxId = `${prefix}-listbox`;
  const allOptions = opts.options;
  let isOpen = false;
  let inputValue = "";
  let selectedValue: string | null = opts.defaultValue ?? null;
  let highlightedValue: string | null = null;

  const defaultFilter = (opt: ComboboxOption, query: string) =>
    opt.label.toLowerCase().includes(query.toLowerCase());

  const filterFn = opts.filter ?? defaultFilter;

  function getFiltered(): ComboboxOption[] {
    if (!inputValue) return allOptions;
    return allOptions.filter((o) => filterFn(o, inputValue));
  }

  function getEnabled(options: ComboboxOption[]): ComboboxOption[] {
    return options.filter((o) => !o.disabled);
  }

  function open() {
    isOpen = true;
    const filtered = getFiltered();
    const enabled = getEnabled(filtered);
    highlightedValue = enabled[0]?.value ?? null;
    opts.onInputChange?.(inputValue);
  }

  function close() {
    isOpen = false;
    highlightedValue = null;
  }

  function select(value: string) {
    const opt = allOptions.find((o) => o.value === value);
    if (opt && !opt.disabled) {
      selectedValue = value;
      inputValue = opt.label;
      opts.onSelect?.(value);
      close();
    }
  }

  function highlight(direction: 1 | -1) {
    const filtered = getFiltered();
    const enabled = getEnabled(filtered);
    if (!enabled.length) return;
    const idx = enabled.findIndex((o) => o.value === highlightedValue);
    const next = (idx + direction + enabled.length) % enabled.length;
    highlightedValue = enabled[next].value;
  }

  function handleInput(e: Event) {
    inputValue = (e.target as HTMLInputElement).value;
    opts.onInputChange?.(inputValue);
    if (!isOpen) open();
    const filtered = getFiltered();
    const enabled = getEnabled(filtered);
    highlightedValue = enabled[0]?.value ?? null;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      open();
      return;
    }

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
        const filtered1 = getFiltered();
        highlightedValue = getEnabled(filtered1)[0]?.value ?? null;
        break;
      case "End":
        e.preventDefault();
        const filtered2 = getFiltered();
        const en = getEnabled(filtered2);
        highlightedValue = en[en.length - 1]?.value ?? null;
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedValue) select(highlightedValue);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
    }
  }

  return {
    inputProps: {
      role: "combobox" as const,
      "aria-expanded": isOpen,
      "aria-controls": listboxId,
      "aria-activedescendant": highlightedValue
        ? `${prefix}-opt-${highlightedValue}`
        : undefined,
      "aria-autocomplete": "list" as const,
      autoComplete: "off",
      onInput: handleInput,
      onKeyDown: handleKeyDown,
      onFocus: () => { if (!isOpen) open(); },
      onBlur: () => { setTimeout(close, 200); },
    },
    listboxProps: {
      id: listboxId,
      role: "listbox" as const,
      "aria-label": "Suggestions",
    },
    getOptionProps: (value: string) => {
      const opt = allOptions.find((o) => o.value === value);
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
    inputValue,
    selectedValue,
    highlightedValue,
    filteredOptions: getFiltered(),
    open,
    close,
    select,
    setInputValue: (v: string) => { inputValue = v; },
  };
}
