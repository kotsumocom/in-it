/**
 * AdminShell - Admin layout
 * Icon Rail + Header + Optional Sidebar + Content
 *
 * Supports:
 * - NavGroup (grouped navigation items)
 * - Legacy NavItem[] (backward compatible)
 * - Header actions slot & user menu slot
 * - Sidebar (secondary navigation) slot
 * - Mobile hamburger menu
 */
import { useState, useCallback } from "hono/jsx";
import { ThemeToggle } from "../interactive/ThemeToggle.tsx";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for AdminShell — co-located for self-containment. */
export const ADMIN_SHELL_CSS = `/* --- Admin Shell Layout --- */
.ii-admin-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Rail */
.ii-admin-rail {
  width: 56px;
  background: var(--ii-surface);
  border-right: 1px solid var(--ii-outline-variant);
  display: flex;
  flex-direction: column;
  transition: width var(--ii-transition);
  overflow: hidden;
  flex-shrink: 0;
  z-index: 10;
}
.ii-admin-rail--expanded {
  width: 220px;
}
.ii-admin-rail__items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--ii-spacing-2);
  flex: 1;
  overflow-y: auto;
}
.ii-admin-rail__group-label {
  font-size: var(--ii-label-sm);
  font-weight: 600;
  color: var(--ii-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--ii-spacing-3) var(--ii-spacing-3) var(--ii-spacing-1);
  white-space: nowrap;
  opacity: 0;
  transition: opacity var(--ii-transition);
  height: 0;
  overflow: hidden;
}
.ii-admin-rail--expanded .ii-admin-rail__group-label {
  opacity: 1;
  height: auto;
}
.ii-admin-rail__separator {
  height: 1px;
  background: var(--ii-outline-variant);
  margin: var(--ii-spacing-2) var(--ii-spacing-2);
}
.ii-admin-rail__item {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  padding: var(--ii-spacing-3);
  border-radius: var(--ii-shape-sm);
  text-decoration: none;
  color: var(--ii-on-surface-variant);
  white-space: nowrap;
  transition: background var(--ii-transition), color var(--ii-transition);
}
.ii-admin-rail__item:hover {
  background: var(--ii-surface-container-high);
  color: var(--ii-on-surface);
}
.ii-admin-rail__item--active {
  background: var(--ii-primary-container);
  color: var(--ii-on-primary-container);
  font-weight: 500;
}
.ii-admin-rail__icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ii-admin-rail__label {
  font-size: var(--ii-font-base);
  opacity: 0;
  transition: opacity var(--ii-transition);
}
.ii-admin-rail--expanded .ii-admin-rail__label {
  opacity: 1;
}
.ii-admin-rail__footer {
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

/* Sidebar (secondary nav) */
.ii-admin-sidebar {
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
  .ii-admin-rail {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 260px;
    z-index: 100;
    box-shadow: var(--ii-shadow-lg);
  }
  .ii-admin-rail--mobile-open {
    display: flex;
  }
  .ii-admin-rail--mobile-open .ii-admin-rail__label { opacity: 1; }
  .ii-admin-rail--mobile-open .ii-admin-rail__group-label { opacity: 1; height: auto; }
  .ii-admin-sidebar { display: none; }
}
`;

/** A navigation item for the admin sidebar rail. */
export interface NavItem {
  icon: string | any;
  label: string;
  href: string;
}

/** A group of navigation items with a label. */
export interface NavGroup {
  /** Group label (displayed when rail is expanded). */
  label: string;
  /** Navigation items in this group. */
  items: NavItem[];
}

/** Props for the AdminShell layout component. */
export interface AdminShellProps {
  brand?: string | any;
  /** @deprecated Use `navGroups` instead. Flat list of nav items (backward compatible). */
  navItems?: NavItem[];
  /** Grouped navigation items. Takes priority over navItems. */
  navGroups?: NavGroup[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  /** Content rendered in the header actions area (right side). */
  headerActions?: any;
  /** User menu slot (rendered in the rail footer or header). */
  userMenu?: any;
  /** Secondary navigation sidebar content. */
  sidebar?: any;
  children: any;
}

/** Admin dashboard layout with icon rail sidebar, header, and content area. */
export function AdminShell({
  brand = "in-it",
  navItems = [],
  navGroups,
  currentPath = "/",
  onNavigate,
  headerActions,
  userMenu,
  sidebar,
  children,
}: AdminShellProps): any {
  injectCSS("ii-admin-shell", ADMIN_SHELL_CSS);
  injectCSS("ii-admin-shell-mobile", ADMIN_SHELL_MOBILE_CSS);
  const [railExpanded, setRailExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = useCallback(
    (e: Event, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      onNavigate?.(href);
    },
    [onNavigate],
  );

  // Normalize navItems to navGroups for unified rendering
  const groups: NavGroup[] = navGroups ?? [{ label: "", items: navItems }];

  const renderItem = (item: NavItem) => {
    const isActive = currentPath === item.href ||
      (item.href !== "/" && currentPath.startsWith(item.href + "/"));
    return (
      <a
        key={item.href}
        href={item.href}
        class={`ii-admin-rail__item${isActive ? " ii-admin-rail__item--active" : ""}`}
        title={item.label}
        onClick={(e: Event) => handleNavClick(e, item.href)}
      >
        <span class="ii-admin-rail__icon">{item.icon}</span>
        <span class="ii-admin-rail__label">{item.label}</span>
      </a>
    );
  };

  const railClass = [
    "ii-admin-rail",
    railExpanded && "ii-admin-rail--expanded",
    mobileOpen && "ii-admin-rail--mobile-open",
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

      {/* Rail sidebar */}
      <nav
        class={railClass}
        onMouseEnter={() => setRailExpanded(true)}
        onMouseLeave={() => setRailExpanded(false)}
      >
        <div class="ii-admin-rail__items">
          {groups.map((group, gi) => (
            <>
              {gi > 0 && <div class="ii-admin-rail__separator" />}
              {group.label && (
                <div class="ii-admin-rail__group-label">{group.label}</div>
              )}
              {group.items.map(renderItem)}
            </>
          ))}
        </div>
        {userMenu && (
          <div class="ii-admin-rail__footer">{userMenu}</div>
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
            <div class="ii-admin-header__brand">{brand}</div>
          </div>
          <div class="ii-admin-header__actions">
            {headerActions}
            <ThemeToggle compact />
          </div>
        </header>

        <div class="ii-admin-body">
          {sidebar && (
            <aside class="ii-admin-sidebar">{sidebar}</aside>
          )}
          <main class="ii-admin-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}