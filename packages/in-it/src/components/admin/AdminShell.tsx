/**
 * AdminShell - Modern admin layout
 * Full sidebar + Header + Optional SubNav + Content
 *
 * Supports:
 * - NavGroup (grouped navigation items)
 * - Legacy NavItem[] (backward compatible)
 * - NavItem with children (auto SubNav expansion)
 * - Header actions slot & user menu slot
 * - Sidebar slot (manual secondary navigation)
 * - Mobile hamburger menu with drawer
 * - Collapsible sidebar (button-driven, not hover)
 */
import { useState, useCallback } from "hono/jsx";
import { ThemeToggle } from "../interactive/ThemeToggle.tsx";
import { SubNav } from "./SubNav.tsx";
import type { SubNavItem } from "./SubNav.tsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for AdminShell — co-located for self-containment. */
export const ADMIN_SHELL_CSS = `/* --- Admin Shell Layout --- */
.ii-admin-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar */
.ii-admin-sidebar-nav {
  width: 240px;
  background: var(--ii-surface);
  border-right: 1px solid var(--ii-outline-variant);
  display: flex;
  flex-direction: column;
  transition: width var(--ii-transition);
  overflow: hidden;
  flex-shrink: 0;
  z-index: 10;
}
.ii-admin-sidebar-nav--collapsed {
  width: 56px;
}
.ii-admin-sidebar-nav__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ii-spacing-3) var(--ii-spacing-3);
  border-bottom: 1px solid var(--ii-outline-variant);
  min-height: 56px;
  gap: var(--ii-spacing-2);
}
.ii-admin-sidebar-nav__brand {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.ii-admin-sidebar-nav--collapsed .ii-admin-sidebar-nav__brand {
  display: none;
}
.ii-admin-sidebar-nav__collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--ii-on-surface-variant);
  cursor: pointer;
  border-radius: var(--ii-shape-sm);
  flex-shrink: 0;
}
.ii-admin-sidebar-nav__collapse-btn:hover {
  background: var(--ii-surface-container-high);
}
.ii-admin-sidebar-nav__items {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: var(--ii-spacing-2);
  flex: 1;
  overflow-y: auto;
}
.ii-admin-sidebar-nav__group-label {
  font-size: var(--ii-label-sm);
  font-weight: 600;
  color: var(--ii-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--ii-spacing-3) var(--ii-spacing-3) var(--ii-spacing-1);
  white-space: nowrap;
}
.ii-admin-sidebar-nav--collapsed .ii-admin-sidebar-nav__group-label {
  display: none;
}
.ii-admin-sidebar-nav__separator {
  height: 1px;
  background: var(--ii-outline-variant);
  margin: var(--ii-spacing-2) var(--ii-spacing-2);
}
.ii-admin-sidebar-nav__item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  padding: var(--ii-spacing-2) var(--ii-spacing-3);
  border-radius: var(--ii-shape-sm);
  text-decoration: none;
  color: var(--ii-on-surface-variant);
  white-space: nowrap;
  transition: background var(--ii-transition), color var(--ii-transition);
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
  font-size: var(--ii-font-base);
  width: 100%;
  text-align: left;
}
.ii-admin-sidebar-nav__item:hover {
  background: var(--ii-surface-container-high);
  color: var(--ii-on-surface);
}
.ii-admin-sidebar-nav__item--active {
  background: var(--ii-primary-container);
  color: var(--ii-on-primary-container);
  font-weight: 500;
}
.ii-admin-sidebar-nav__icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ii-admin-sidebar-nav__label {
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}
.ii-admin-sidebar-nav--collapsed .ii-admin-sidebar-nav__label {
  display: none;
}
.ii-admin-sidebar-nav__expand-indicator {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  flex-shrink: 0;
  transition: transform 150ms ease;
}
.ii-admin-sidebar-nav__expand-indicator--open {
  transform: rotate(90deg);
}
.ii-admin-sidebar-nav--collapsed .ii-admin-sidebar-nav__expand-indicator {
  display: none;
}
.ii-admin-sidebar-nav__children {
  padding-left: var(--ii-spacing-4);
}
.ii-admin-sidebar-nav__footer {
  padding: var(--ii-spacing-2);
  border-top: 1px solid var(--ii-outline-variant);
  flex-shrink: 0;
}

/* Main */
.ii-admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Header */
.ii-admin-header {
  height: 56px;
  padding: 0 var(--ii-spacing-6);
  border-bottom: 1px solid var(--ii-outline-variant);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  gap: var(--ii-spacing-4);
}
.ii-admin-header__left {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  min-width: 0;
}
.ii-admin-header__brand {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
}
.ii-admin-header__actions {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  flex-shrink: 0;
}

/* Body = sidebar + content */
.ii-admin-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

/* Sidebar secondary (manual slot) */
.ii-admin-sidebar-secondary {
  width: 240px;
  background: var(--ii-surface);
  border-right: 1px solid var(--ii-outline-variant);
  overflow-y: auto;
  flex-shrink: 0;
  padding: var(--ii-spacing-4);
}

/* Content */
.ii-admin-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--ii-spacing-6);
}
`;

/** @internal CSS for AdminShell mobile — co-located for self-containment. */
export const ADMIN_SHELL_MOBILE_CSS = `/* --- AdminShell Mobile --- */
.ii-admin-header__hamburger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: var(--ii-on-surface);
  cursor: pointer;
  border-radius: var(--ii-shape-sm);
}
.ii-admin-header__hamburger:hover {
  background: var(--ii-surface-container-high);
}
.ii-admin-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}
.ii-admin-overlay--open { display: block; }
@media (max-width: 768px) {
  .ii-admin-header__hamburger { display: flex; }
  .ii-admin-sidebar-nav {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 280px;
    z-index: 100;
    box-shadow: var(--ii-shadow-lg);
  }
  .ii-admin-sidebar-nav--mobile-open {
    display: flex;
  }
  .ii-admin-sidebar-nav--mobile-open .ii-admin-sidebar-nav__label { display: inline; }
  .ii-admin-sidebar-nav--mobile-open .ii-admin-sidebar-nav__group-label { display: block; }
  .ii-admin-sidebar-nav--mobile-open .ii-admin-sidebar-nav__expand-indicator { display: inline; }
  .ii-admin-sidebar-nav__collapse-btn { display: none; }
  .ii-admin-sidebar-secondary { display: none; }
}
`;

/** A navigation item for the admin sidebar. */
export interface NavItem {
  /** Icon (string icon name or JSX element). */
  icon: string | any;
  /** Display label. */
  label: string;
  /** Navigation target or base path for active detection. */
  href: string;
  /** Sub-navigation items. When present, tapping this item
   *  expands the children inline instead of navigating. */
  children?: SubNavItem[];
}

/** A group of navigation items with a label. */
export interface NavGroup {
  /** Group label (displayed in expanded sidebar). */
  label: string;
  /** Navigation items in this group. */
  items: NavItem[];
}

/** Props for the AdminShell layout component. */
export interface AdminShellProps {
  /** Brand text or JSX (displayed in sidebar header). */
  brand?: string | any;
  /** @deprecated Use `navGroups` instead. Flat list of nav items (backward compatible). */
  navItems?: NavItem[];
  /** Grouped navigation items. Takes priority over navItems. */
  navGroups?: NavGroup[];
  /** Current path for active highlighting. */
  currentPath?: string;
  /** Called when a navigation item is clicked. */
  onNavigate?: (href: string) => void;
  /** Content rendered in the header actions area (right side). */
  headerActions?: any;
  /** User menu slot (rendered in the sidebar footer). */
  userMenu?: any;
  /** Secondary navigation sidebar content (manual slot, overrides auto SubNav). */
  sidebar?: any;
  /** Start with sidebar collapsed. Default: false. */
  defaultCollapsed?: boolean;
  /** Main content. */
  children: any;
}

/** Chevron-right SVG for expand indicators. */
function ChevronRight(): any {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/** Sidebar collapse/expand toggle icon. */
function SidebarToggleIcon({ collapsed }: { collapsed: boolean }): any {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {collapsed ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <polyline points="14 9 17 12 14 15" />
        </>
      ) : (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <polyline points="16 9 13 12 16 15" />
        </>
      )}
    </svg>
  );
}

/** Admin dashboard layout with full sidebar, header, and content area. */
export function AdminShell({
  brand = "in-it",
  navItems = [],
  navGroups,
  currentPath = "/",
  onNavigate,
  headerActions,
  userMenu,
  sidebar,
  defaultCollapsed = false,
  children,
}: AdminShellProps): any {
  injectCSS("ii-admin-shell", ADMIN_SHELL_CSS);
  injectCSS("ii-admin-shell-mobile", ADMIN_SHELL_MOBILE_CSS);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleNavClick = useCallback(
    (e: Event, item: NavItem) => {
      e.preventDefault();
      if (item.children && item.children.length > 0) {
        // Toggle SubNav expansion
        setExpandedItem((prev) => (prev === item.href ? null : item.href));
      } else {
        // Navigate
        setMobileOpen(false);
        onNavigate?.(item.href);
      }
    },
    [onNavigate],
  );

  const handleSubNavClick = useCallback(
    (href: string) => {
      setMobileOpen(false);
      onNavigate?.(href);
    },
    [onNavigate],
  );

  // Normalize navItems to navGroups for unified rendering
  const groups: NavGroup[] = navGroups ?? [{ label: "", items: navItems }];

  // Auto-expand the group containing the current path
  const autoExpandedHref = (() => {
    for (const group of groups) {
      for (const item of group.items) {
        if (item.children) {
          const match = item.children.some(
            (child) =>
              currentPath === child.href ||
              (child.href !== "/" && currentPath.startsWith(child.href + "/")),
          );
          if (match) return item.href;
        }
      }
    }
    return null;
  })();

  // Use explicit expandedItem or auto-expand
  const activeExpanded = expandedItem ?? autoExpandedHref;

  const renderItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = activeExpanded === item.href;
    const isActive = hasChildren
      ? isExpanded
      : currentPath === item.href ||
        (item.href !== "/" && currentPath.startsWith(item.href + "/"));

    return (
      <>
        <a
          key={item.href}
          href={item.href}
          class={`ii-admin-sidebar-nav__item${isActive ? " ii-admin-sidebar-nav__item--active" : ""}`}
          title={item.label}
          onClick={(e: Event) => handleNavClick(e, item)}
        >
          <span class="ii-admin-sidebar-nav__icon">{item.icon}</span>
          <span class="ii-admin-sidebar-nav__label">{item.label}</span>
          {hasChildren && (
            <span
              class={`ii-admin-sidebar-nav__expand-indicator${isExpanded ? " ii-admin-sidebar-nav__expand-indicator--open" : ""}`}
            >
              <ChevronRight />
            </span>
          )}
        </a>
        {hasChildren && isExpanded && (
          <div class="ii-admin-sidebar-nav__children">
            <SubNav
              items={item.children}
              currentPath={currentPath}
              onNavigate={handleSubNavClick}
            />
          </div>
        )}
      </>
    );
  };

  const sidebarClass = [
    "ii-admin-sidebar-nav",
    collapsed && "ii-admin-sidebar-nav--collapsed",
    mobileOpen && "ii-admin-sidebar-nav--mobile-open",
  ].filter(Boolean).join(" ");

  return (
    <div class="ii-admin-shell">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          class="ii-admin-overlay ii-admin-overlay--open"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav class={sidebarClass}>
        <div class="ii-admin-sidebar-nav__header">
          <div class="ii-admin-sidebar-nav__brand">{brand}</div>
          <button
            class="ii-admin-sidebar-nav__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "サイドバーを展開" : "サイドバーを折りたたみ"}
          >
            <SidebarToggleIcon collapsed={collapsed} />
          </button>
        </div>

        <div class="ii-admin-sidebar-nav__items">
          {groups.map((group, gi) => (
            <>
              {gi > 0 && <div class="ii-admin-sidebar-nav__separator" />}
              {group.label && (
                <div class="ii-admin-sidebar-nav__group-label">
                  {group.label}
                </div>
              )}
              {group.items.map(renderItem)}
            </>
          ))}
        </div>
        {userMenu && (
          <div class="ii-admin-sidebar-nav__footer">{userMenu}</div>
        )}
      </nav>

      {/* Main area */}
      <div class="ii-admin-main">
        <header class="ii-admin-header">
          <div class="ii-admin-header__left">
            <button
              class="ii-admin-header__hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="メニュー"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
          <div class="ii-admin-header__actions">
            {headerActions}
            <ThemeToggle compact />
          </div>
        </header>

        <div class="ii-admin-body">
          {sidebar && (
            <aside class="ii-admin-sidebar-secondary">{sidebar}</aside>
          )}
          <main class="ii-admin-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}