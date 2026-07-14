/**
 * AdminShell - Admin layout
 * Icon Rail + Header + Content
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
}
.ii-admin-rail__label {
  font-size: var(--ii-font-base);
  opacity: 0;
  transition: opacity var(--ii-transition);
}
.ii-admin-rail--expanded .ii-admin-rail__label {
  opacity: 1;
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
}
.ii-admin-header__brand {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
}
.ii-admin-header__actions {
  display: flex;
  gap: var(--ii-spacing-2);
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
  .ii-admin-rail--mobile-open {
    display: flex;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 260px;
    z-index: 100;
    box-shadow: var(--ii-shadow-lg);
  }
  .ii-admin-rail--mobile-open .ii-admin-rail__label { opacity: 1; }
}
`;

/** A navigation item for the admin sidebar rail. */
export interface NavItem {
  icon: string;
  label: string;
  href: string;
}

/** Props for the AdminShell layout component. */
export interface AdminShellProps {
  brand?: string;
  navItems?: NavItem[];
  currentPath?: string;
  onNavigate?: (href: string) => void;
  children: any;
}

/** Admin dashboard layout with icon rail sidebar, header, and content area. */
export function AdminShell({
  brand = "in-it",
  navItems = [],
  currentPath = "/",
  onNavigate,
  children,
}: AdminShellProps): any {
  injectCSS("ii-admin-shell", ADMIN_SHELL_CSS);
  const [railExpanded, setRailExpanded] = useState(false);

  const handleNavClick = useCallback(
    (e: Event, href: string) => {
      e.preventDefault();
      onNavigate?.(href);
    },
    [onNavigate],
  );

  return (
    <div class="ii-admin-shell">
      <nav
        class={`ii-admin-rail${railExpanded ? " ii-admin-rail--expanded" : ""}`}
        onMouseEnter={() => setRailExpanded(true)}
        onMouseLeave={() => setRailExpanded(false)}
      >
        <div class="ii-admin-rail__items">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
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
          })}
        </div>
      </nav>

      <div class="ii-admin-main">
        <header class="ii-admin-header">
          <div class="ii-admin-header__brand">{brand}</div>
          <div class="ii-admin-header__actions">
            <ThemeToggle compact />
          </div>
        </header>

        <main class="ii-admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}