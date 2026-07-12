/**
 * @module aria
 * WAI-ARIA APG 準拠のアクセシビリティヘルパー。
 * フレームワーク非依存。W3C APG を参照して自前実装。
 * Zag.js のソースコードは一切参照していない。
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
