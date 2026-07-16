/**
 * SubNav - Secondary navigation component for admin layouts.
 *
 * Renders a vertical list of navigation links, optionally grouped
 * with section labels. Designed to be used inside AdminShell's sidebar
 * area or as a standalone component.
 *
 * Supports:
 * - Flat item list (items prop)
 * - Grouped items with section labels (groups prop)
 * - Active path highlighting
 * - Optional badge display
 * - Optional icons
 */
import { useCallback } from "hono/jsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for SubNav — co-located for self-containment. */
export const SUBNAV_CSS = `/* --- SubNav --- */
.ii-subnav {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ii-subnav__group {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ii-subnav__group + .ii-subnav__group {
  margin-top: var(--ii-spacing-3);
}
.ii-subnav__group-label {
  font-size: var(--ii-label-sm);
  font-weight: 600;
  color: var(--ii-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--ii-spacing-2) var(--ii-spacing-3);
}
.ii-subnav__item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  padding: var(--ii-spacing-2) var(--ii-spacing-3);
  border-radius: var(--ii-shape-sm);
  text-decoration: none;
  color: var(--ii-on-surface-variant);
  font-size: var(--ii-font-sm);
  transition: background var(--ii-transition), color var(--ii-transition);
  cursor: pointer;
}
.ii-subnav__item:hover {
  background: var(--ii-surface-container-high);
  color: var(--ii-on-surface);
}
.ii-subnav__item--active {
  background: var(--ii-primary-container);
  color: var(--ii-on-primary-container);
  font-weight: 500;
}
.ii-subnav__icon {
  font-size: 1rem;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ii-subnav__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ii-subnav__badge {
  font-size: var(--ii-label-sm);
  background: var(--ii-surface-container-highest);
  color: var(--ii-on-surface-variant);
  padding: 1px 6px;
  border-radius: var(--ii-shape-full);
  flex-shrink: 0;
}
.ii-subnav__item--active .ii-subnav__badge {
  background: var(--ii-on-primary-container);
  color: var(--ii-primary-container);
}
`;

/** A secondary navigation item. */
export interface SubNavItem {
  /** Display label. */
  label: string;
  /** Navigation target. */
  href: string;
  /** Optional icon (string icon name or JSX). */
  icon?: string | any;
  /** Optional badge (e.g., count or status label). */
  badge?: string | number;
}

/** A group of secondary navigation items with an optional label. */
export interface SubNavGroup {
  /** Section label (displayed above the group). */
  label?: string;
  /** Navigation items in this group. */
  items: SubNavItem[];
}

/** Props for the SubNav component. */
export interface SubNavProps {
  /** Flat list of items (shorthand for a single unnamed group). */
  items?: SubNavItem[];
  /** Grouped items with optional section labels. Takes priority over items. */
  groups?: SubNavGroup[];
  /** Current active path for highlighting. */
  currentPath?: string;
  /** Called when a navigation item is clicked. */
  onNavigate?: (href: string) => void;
}

/** Secondary navigation for admin layouts. */
export function SubNav({
  items,
  groups,
  currentPath = "/",
  onNavigate,
}: SubNavProps): any {
  injectCSS("ii-subnav", SUBNAV_CSS);

  const handleClick = useCallback(
    (e: Event, href: string) => {
      e.preventDefault();
      onNavigate?.(href);
    },
    [onNavigate],
  );

  // Normalize to groups
  const resolvedGroups: SubNavGroup[] = groups ?? [{ items: items ?? [] }];

  const renderItem = (item: SubNavItem) => {
    const isActive = currentPath === item.href ||
      (item.href !== "/" && currentPath.startsWith(item.href + "/"));
    return (
      <a
        key={item.href}
        href={item.href}
        class={`ii-subnav__item${isActive ? " ii-subnav__item--active" : ""}`}
        onClick={(e: Event) => handleClick(e, item.href)}
      >
        {item.icon && <span class="ii-subnav__icon">{item.icon}</span>}
        <span class="ii-subnav__label">{item.label}</span>
        {item.badge != null && (
          <span class="ii-subnav__badge">{item.badge}</span>
        )}
      </a>
    );
  };

  return (
    <nav class="ii-subnav">
      {resolvedGroups.map((group) => (
        <div class="ii-subnav__group">
          {group.label && (
            <div class="ii-subnav__group-label">{group.label}</div>
          )}
          {group.items.map(renderItem)}
        </div>
      ))}
    </nav>
  );
}
