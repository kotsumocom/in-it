/**
 * PageHeader — Page header with title, description, and actions
 * Common pattern in admin pages: title + description + action buttons.
 * Inspired by Supabase / Vercel admin panel headers.
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for PageHeader — co-located for self-containment. */
export const PAGE_HEADER_CSS = `/* --- PageHeader --- */
.ii-page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--ii-spacing-4); margin-bottom: var(--ii-spacing-6); }
.ii-page-header__content { flex: 1; min-width: 0; }
.ii-page-header__breadcrumb { margin-bottom: var(--ii-spacing-2); }
.ii-page-header__title { font-size: var(--ii-headline-sm); font-weight: 600; color: var(--ii-on-surface); margin: 0; line-height: 1.3; }
.ii-page-header__desc { font-size: var(--ii-body-md); color: var(--ii-on-surface-variant); margin: var(--ii-spacing-1) 0 0; }
.ii-page-header__actions { display: flex; align-items: center; gap: var(--ii-spacing-2); flex-shrink: 0; }
@media (max-width: 640px) {
  .ii-page-header { flex-direction: column; }
  .ii-page-header__actions { width: 100%; }
}
`;

/** Props for the PageHeader component. */
export interface PageHeaderProps {
  /** Page title (rendered as h2). */
  title: string;
  /** Optional description below the title. */
  description?: string;
  /** Action buttons or elements displayed on the right. */
  actions?: any;
  /** Breadcrumb element displayed above the title. */
  breadcrumb?: any;
}

/**
 * Admin page header with title, description, and action buttons.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="ダッシュボード"
 *   description="帳簿の概要。"
 * />
 *
 * <PageHeader
 *   title="仕訳一覧"
 *   description="取引の記録と管理。"
 *   actions={<Button variant="filled">新規追加</Button>}
 * />
 * ```
 */
export function PageHeader({ title, description, actions, breadcrumb }: PageHeaderProps): any {
  injectCSS("ii-page-header", PAGE_HEADER_CSS);
  return (
    <div class="ii-page-header">
      <div class="ii-page-header__content">
        {breadcrumb && <div class="ii-page-header__breadcrumb">{breadcrumb}</div>}
        <h2 class="ii-page-header__title">{title}</h2>
        {description && <p class="ii-page-header__desc">{description}</p>}
      </div>
      {actions && <div class="ii-page-header__actions">{actions}</div>}
    </div>
  );
}
