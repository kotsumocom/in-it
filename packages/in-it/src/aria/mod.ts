/**
 * @module aria
 * WAI-ARIA APG 準拠のアクセシビリティヘルパー。
 * フレームワーク非依存。
 */

export { createSwitch } from "./switch.ts";
export type { SwitchApi, SwitchState, CreateSwitchOptions } from "./switch.ts";

export { createDialog } from "./dialog.ts";
export type { DialogApi, CreateDialogOptions } from "./dialog.ts";

export { createTabs } from "./tabs.ts";
export type { TabsApi, TabItem, CreateTabsOptions } from "./tabs.ts";
