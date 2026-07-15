/**
 * ListItem — Clickable list row with icon, title, subtitle, and trailing action
 * Common pattern for dashboards, settings, and navigation lists.
 * Inspired by Vercel project list, Supabase table list, Linear issue list.
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for ListItem — co-located for self-containment. */
export const LIST_ITEM_CSS = `/* --- ListItem --- */
.ii-list-item { display: flex; align-items: center; gap: var(--ii-spacing-3); padding: var(--ii-spacing-3) var(--ii-spacing-4); border-radius: var(--ii-shape-md); transition: background var(--ii-transition); text-decoration: none; color: inherit; }
.ii-list-item--interactive { cursor: pointer; }
.ii-list-item--interactive:hover { background: var(--ii-surface-container); }
.ii-list-item__icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: var(--ii-on-surface-variant); }
.ii-list-item__body { flex: 1; min-width: 0; }
.ii-list-item__title { font-size: var(--ii-body-lg); font-weight: 500; color: var(--ii-on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ii-list-item__subtitle { font-size: var(--ii-body-sm); color: var(--ii-on-surface-variant); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ii-list-item__trailing { flex-shrink: 0; display: flex; align-items: center; gap: var(--ii-spacing-2); }
`;

/** Props for the ListItem component. */
export interface ListItemProps {
  /** Icon element displayed on the left. */
  icon?: any;
  /** Primary text. */
  title: string;
  /** Secondary text below the title. */
  subtitle?: string;
  /** Trailing element (badge, button, etc.) on the right. */
  trailing?: any;
  /** Click handler. Makes the item interactive. */
  onClick?: string;
  /** Link target. Renders as <a> instead of <div>. */
  href?: string;
}

/**
 * List row with icon, title, subtitle, and trailing action.
 *
 * @example
 * ```tsx
 * <ListItem
 *   icon={<Icon name="book" />}
 *   title="2024年度 政治資金"
 *   subtitle="12件の仕訳"
 *   trailing={<Badge>公開中</Badge>}
 *   href="/books/2024"
 * />
 * ```
 */
export function ListItem({ icon, title, subtitle, trailing, onClick, href }: ListItemProps): any {
  injectCSS("ii-list-item", LIST_ITEM_CSS);
  const isInteractive = !!(onClick || href);
  const cls = `ii-list-item${isInteractive ? " ii-list-item--interactive" : ""}`;
  const content = (
    <>
      {icon && <div class="ii-list-item__icon">{icon}</div>}
      <div class="ii-list-item__body">
        <div class="ii-list-item__title">{title}</div>
        {subtitle && <div class="ii-list-item__subtitle">{subtitle}</div>}
      </div>
      {trailing && <div class="ii-list-item__trailing">{trailing}</div>}
    </>
  );
  if (href) {
    return <a class={cls} href={href}>{content}</a>;
  }
  return <div class={cls} onclick={onClick}>{content}</div>;
}
