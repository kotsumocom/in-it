/**
 * AdminShell 窶・邂｡逅・判髱｢縺ｮ繝｡繧､繝ｳ繝ｬ繧､繧｢繧ｦ繝・ * Icon Rail + Header + Content 繧ｨ繝ｪ繧｢
 */
import { useState, useCallback } from "hono/jsx";
import { ThemeToggle } from "../interactive/ThemeToggle.tsx";

/** 繝翫ン繧ｲ繝ｼ繧ｷ繝ｧ繝ｳ鬆・岼 */
export interface NavItem {
  icon: string;  // SVG 譁・ｭ怜・ or emoji
  label: string;
  href: string;
}

export interface AdminShellProps {
  brand?: string;
  navItems?: NavItem[];
  /** 迴ｾ蝨ｨ縺ｮ繝代せ・医Ν繝ｼ繧ｿ繝ｼ縺九ｉ蜿励￠蜿悶ｋ・・*/
  currentPath?: string;
  /** 繝翫ン繧ｲ繝ｼ繧ｷ繝ｧ繝ｳ髢｢謨ｰ・・PA 繝ｫ繝ｼ繧ｿ繝ｼ縺九ｉ蜿励￠蜿悶ｋ・・*/
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
    <div class="ii-admin-shell">
      {/* Icon Rail */}
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

      {/* Main Area */}
      <div class="ii-admin-main">
        {/* Header */}
        <header class="ii-admin-header">
          <div class="ii-admin-header__brand">{brand}</div>
          <div class="ii-admin-header__actions">
            <button class="ii-btn ii-btn--text ii-btn--sm" type="button">剥</button>
            <button class="ii-btn ii-btn--text ii-btn--sm" type="button">粕</button>
            <ThemeToggle simple />
            <button class="ii-btn ii-btn--text ii-btn--sm" type="button">側</button>
          </div>
        </header>

        {/* Content */}
        <main class="ii-admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}

