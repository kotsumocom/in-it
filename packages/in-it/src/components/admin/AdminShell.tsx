/**
 * AdminShell — 管理画面のメインレイアウト
 * Icon Rail + Header + Content エリア
 */
import { useState, useCallback } from "hono/jsx";

/** ナビゲーション項目 */
export interface NavItem {
  icon: string;  // SVG 文字列 or emoji
  label: string;
  href: string;
}

export interface AdminShellProps {
  brand?: string;
  navItems?: NavItem[];
  /** 現在のパス（ルーターから受け取る） */
  currentPath?: string;
  /** ナビゲーション関数（SPA ルーターから受け取る） */
  onNavigate?: (href: string) => void;
  children: any;
}

export function AdminShell({
  brand = "in-it",
  navItems = [],
  currentPath = "/",
  onNavigate,
  children,
}: AdminShellProps) {
  const [railExpanded, setRailExpanded] = useState(false);

  const handleNavClick = useCallback(
    (e: Event, href: string) => {
      e.preventDefault();
      onNavigate?.(href);
    },
    [onNavigate],
  );

  return (
    <div class="sc-admin-shell">
      {/* Icon Rail */}
      <nav
        class={`sc-admin-rail${railExpanded ? " sc-admin-rail--expanded" : ""}`}
        onMouseEnter={() => setRailExpanded(true)}
        onMouseLeave={() => setRailExpanded(false)}
      >
        <div class="sc-admin-rail__items">
          {navItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                class={`sc-admin-rail__item${isActive ? " sc-admin-rail__item--active" : ""}`}
                title={item.label}
                onClick={(e: Event) => handleNavClick(e, item.href)}
              >
                <span class="sc-admin-rail__icon">{item.icon}</span>
                <span class="sc-admin-rail__label">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Main Area */}
      <div class="sc-admin-main">
        {/* Header */}
        <header class="sc-admin-header">
          <div class="sc-admin-header__brand">{brand}</div>
          <div class="sc-admin-header__actions">
            <button class="sc-btn sc-btn--text sc-btn--sm" type="button">🔍</button>
            <button class="sc-btn sc-btn--text sc-btn--sm" type="button">🔔</button>
            <button class="sc-btn sc-btn--text sc-btn--sm" type="button">👤</button>
          </div>
        </header>

        {/* Content */}
        <main class="sc-admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
