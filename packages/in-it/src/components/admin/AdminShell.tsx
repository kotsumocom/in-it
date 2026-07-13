/**
 * AdminShell - Admin layout
 * Icon Rail + Header + Content
 */
import { useState, useCallback } from "hono/jsx";
import { ThemeToggle } from "../interactive/ThemeToggle.tsx";

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