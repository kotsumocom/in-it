/**
 * @module aria
 * WAI-ARIA APG compliant accessibility helpers.
 * Framework-agnostic. Self-implemented following W3C APG.
 * No reference to Zag.js source code.
 *
 * @example
 * ```ts
 * import { createSwitch, createDialog } from "@kotsumo/in-it/aria";
 *
 * const sw = createSwitch({ checked: false, onChange: console.log });
 * // Apply sw.rootProps to <button> and sw.labelProps to <label>
 *
 * const dialog = createDialog({ onClose: () => console.log("closed") });
 * // Apply dialog.contentProps to <div role="dialog">
 * ```
 */

export { createSwitch } from "./switch.ts";
export type { SwitchApi, SwitchState, CreateSwitchOptions } from "./switch.ts";

export { createDialog } from "./dialog.ts";
export type { DialogApi, CreateDialogOptions } from "./dialog.ts";

export { createTabs } from "./tabs.ts";
export type { TabsApi, TabItem, CreateTabsOptions } from "./tabs.ts";

export { createMenu } from "./menu.ts";
export type { MenuApi, MenuItem, CreateMenuOptions } from "./menu.ts";

export { createTooltip } from "./tooltip.ts";
export type { TooltipApi, CreateTooltipOptions } from "./tooltip.ts";

export { createToastManager } from "./toast.ts";
export type { ToastApi, Toast, ToastVariant, CreateToastOptions } from "./toast.ts";

export { createSelect } from "./select.ts";
export type { SelectApi, SelectOption, CreateSelectOptions } from "./select.ts";

export { createAccordion } from "./accordion.ts";
export type { AccordionApi, AccordionItem, CreateAccordionOptions } from "./accordion.ts";

export { createPopover } from "./popover.ts";
export type { PopoverApi, CreatePopoverOptions } from "./popover.ts";

export { createCombobox } from "./combobox.ts";
export type { ComboboxApi, ComboboxOption, CreateComboboxOptions } from "./combobox.ts";
