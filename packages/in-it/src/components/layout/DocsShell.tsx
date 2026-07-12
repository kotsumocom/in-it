/**
 * DocsShell — Documentation layout (Sidebar + Content + TOC)
 */

export interface DocsSidebarItem {
  href: string;
  label: string;
  active?: boolean;
}

export interface DocsSidebarGroup {
  group: string;
  items: DocsSidebarItem[];
}

export interface DocsTocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface DocsShellProps {
  brand: string;
  brandHref?: string;
  navLinks?: { href: string; label: string }[];
  sidebarGroups: DocsSidebarGroup[];
  tocItems?: DocsTocItem[];
  children: any;
  themeToggle?: any;
}

export function DocsShell({ brand, brandHref = "/", navLinks = [], sidebarGroups, tocItems = [], children, themeToggle }: DocsShellProps) {
  return (
    <div class="ii-docs-shell">
      <header class="ii-docs-header">
        <div class="ii-docs-header__inner">
          <a href={brandHref} class="ii-docs-header__brand">{brand}</a>
          <nav class="ii-docs-header__nav">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} class="ii-docs-header__link">{link.label}</a>
            ))}
            {themeToggle}
          </nav>
        </div>
      </header>
      <div class="ii-docs-body">
        <aside class="ii-docs-sidebar">
          {sidebarGroups.map(group => (
            <div key={group.group} class="ii-docs-sidebar__group">
              <div class="ii-docs-sidebar__group-label">{group.group}</div>
              {group.items.map(item => (
                <a key={item.href} href={item.href}
                  class={`ii-docs-sidebar__link${item.active ? " ii-docs-sidebar__link--active" : ""}`}>
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </aside>
        <main class="ii-docs-content">
          <article class="ii-docs-article">
            {children}
          </article>
          {tocItems.length > 0 && (
            <DocsPager />
          )}
        </main>
        {tocItems.length > 0 && (
          <nav class="ii-docs-toc">
            <div class="ii-docs-toc__title"></div>
            {tocItems.map(item => (
              <a key={item.id} href={`#${item.id}`}
                class={`ii-docs-toc__link${item.level === 3 ? " ii-docs-toc__link--h3" : ""}`}>
                {item.text}
              </a>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

function DocsPager() { return null; } // placeholder
