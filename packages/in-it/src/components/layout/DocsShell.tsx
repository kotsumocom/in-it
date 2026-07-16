/**
 * DocsShell — Documentation layout (Sidebar + Content + TOC)
 */

import { injectCSS } from "../../inject.ts";

/** @internal CSS for DocsShell — co-located for self-containment. */
export const DOCS_CSS = `/* --- Docs Layout --- */
.ii-docs-shell { display: flex; flex-direction: column; min-height: 100vh; }
.ii-docs-header { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--ii-surface) 90%, transparent); backdrop-filter: blur(12px); border-bottom: 1px solid var(--ii-outline-variant); }
.ii-docs-header__inner { max-width: 1400px; margin: 0 auto; padding: 10px 24px; display: flex; align-items: center; justify-content: space-between; }
.ii-docs-header__brand { font-weight: 700; font-size: 1.125rem; text-decoration: none; color: var(--ii-on-surface); }
.ii-docs-header__nav { display: flex; align-items: center; gap: 20px; }
.ii-docs-header__link { font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); text-decoration: none; }
.ii-docs-header__link:hover { color: var(--ii-primary); }

.ii-docs-body { display: flex; flex: 1; max-width: 1400px; margin: 0 auto; width: 100%; }

.ii-docs-sidebar { width: 260px; flex-shrink: 0; padding: 24px 16px; border-right: 1px solid var(--ii-outline-variant); overflow-y: auto; position: sticky; top: 49px; height: calc(100vh - 49px); }
.ii-docs-sidebar__group { margin-bottom: 20px; }
.ii-docs-sidebar__group-label { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ii-on-surface-variant); margin-bottom: 8px; padding: 0 12px; }
.ii-docs-sidebar__link { display: block; padding: 6px 12px; border-radius: var(--ii-shape-sm); font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); text-decoration: none; transition: all var(--ii-transition); }
.ii-docs-sidebar__link:hover { background: var(--ii-surface-container); color: var(--ii-on-surface); }
.ii-docs-sidebar__link--active { background: color-mix(in srgb, var(--ii-primary) 12%, var(--ii-surface)); color: var(--ii-primary); font-weight: 500; }

/* Collapsible group/subgroup (details/summary) */
.ii-docs-sidebar__group > details,
.ii-docs-sidebar__subgroup { border: none; margin: 0; }
.ii-docs-sidebar__group > details > summary,
.ii-docs-sidebar__subgroup > summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 4px; user-select: none; }
.ii-docs-sidebar__group > details > summary::-webkit-details-marker,
.ii-docs-sidebar__subgroup > summary::-webkit-details-marker { display: none; }
.ii-docs-sidebar__group > details > summary::marker,
.ii-docs-sidebar__subgroup > summary::marker { display: none; content: ""; }

/* Chevron for collapsible groups */
.ii-docs-sidebar__chevron { width: 14px; height: 14px; flex-shrink: 0; transition: transform 0.15s ease; stroke: currentColor; }
details[open] > summary .ii-docs-sidebar__chevron { transform: rotate(90deg); }

/* Group-level collapsible label */
.ii-docs-sidebar__group > details > summary .ii-docs-sidebar__group-label { margin-bottom: 0; cursor: pointer; flex: 1; }
.ii-docs-sidebar__group > details > .ii-docs-sidebar__group-content { padding-top: 8px; }

/* Subgroup */
.ii-docs-sidebar__subgroup { margin-bottom: 4px; }
.ii-docs-sidebar__subgroup-label { font-size: 0.625rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ii-on-surface-variant); opacity: 0.7; padding: 4px 12px; cursor: pointer; flex: 1; }
.ii-docs-sidebar__subgroup-content { }

.ii-docs-content { flex: 1; min-width: 0; padding: 32px 48px; max-width: 800px; }

.ii-docs-toc { width: 200px; flex-shrink: 0; padding: 24px 16px; position: sticky; top: 49px; height: calc(100vh - 49px); overflow-y: auto; }
.ii-docs-toc__title { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ii-on-surface-variant); margin-bottom: 12px; }
.ii-docs-toc__link { display: block; padding: 4px 0; font-size: 0.8125rem; color: var(--ii-on-surface-variant); text-decoration: none; border-left: 2px solid transparent; padding-left: 12px; transition: all var(--ii-transition); }
.ii-docs-toc__link:hover { color: var(--ii-on-surface); }
.ii-docs-toc__link--active { color: var(--ii-primary); border-left-color: var(--ii-primary); }
.ii-docs-toc__link--h3 { padding-left: 24px; }

/* Docs article typography */
.ii-docs-article { line-height: 1.7; color: var(--ii-on-surface); }
.ii-docs-article h1 { font-size: 2rem; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.02em; }
.ii-docs-article h2 { font-size: 1.5rem; font-weight: 600; margin-top: 48px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--ii-outline-variant); }
.ii-docs-article h3 { font-size: 1.25rem; font-weight: 600; margin-top: 32px; margin-bottom: 12px; }
.ii-docs-article p { margin-bottom: 16px; }
.ii-docs-article code { padding: 2px 6px; border-radius: 4px; background: var(--ii-surface-container); font-family: monospace; font-size: 0.875em; }
.ii-docs-article pre { padding: 16px; border-radius: var(--ii-shape-md); background: var(--ii-surface-container); overflow-x: auto; margin-bottom: 24px; }
.ii-docs-article pre code { padding: 0; background: none; }
.ii-docs-article ul, .ii-docs-article ol { margin-bottom: 16px; padding-left: 24px; }
.ii-docs-article li { margin-bottom: 8px; }
.ii-docs-article table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
.ii-docs-article th { text-align: left; padding: 8px 12px; border-bottom: 2px solid var(--ii-outline-variant); font-weight: 600; font-size: var(--ii-font-sm); }
.ii-docs-article td { padding: 8px 12px; border-bottom: 1px solid var(--ii-outline-variant); font-size: var(--ii-font-sm); }
.ii-docs-article blockquote { padding: 12px 16px; border-left: 4px solid var(--ii-primary); background: color-mix(in srgb, var(--ii-primary) 4%, var(--ii-surface)); border-radius: 0 var(--ii-shape-sm) var(--ii-shape-sm) 0; margin-bottom: 16px; }
.ii-docs-article a { color: var(--ii-primary); text-decoration: underline; text-underline-offset: 2px; }
.ii-docs-article img { max-width: 100%; border-radius: var(--ii-shape-md); }

/* Code preview placeholder (SSR fallback before hydration) */
.ii-code-preview-placeholder { border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-lg); overflow: hidden; margin-bottom: 24px; }
.ii-code-preview-placeholder__preview { padding: 24px; background: #ffffff; display: flex; align-items: center; justify-content: center; min-height: 80px; }
[data-theme="dark"] .ii-code-preview-placeholder__preview { background: #1a1a2e; }
.ii-code-preview-placeholder__details { border-top: 1px solid var(--ii-outline-variant); }
.ii-code-preview-placeholder__details summary { padding: 8px 16px; font-size: var(--ii-font-sm); color: var(--ii-on-surface-variant); cursor: pointer; background: var(--ii-surface-container); }
.ii-code-preview-placeholder__details pre { margin: 0; padding: 16px; }

/* Prev/Next navigation */
.ii-docs-pager { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--ii-outline-variant); }
.ii-docs-pager__link { display: flex; flex-direction: column; gap: 4px; padding: 16px; border: 1px solid var(--ii-outline-variant); border-radius: var(--ii-shape-md); text-decoration: none; transition: all var(--ii-transition); }
.ii-docs-pager__link:hover { border-color: var(--ii-primary); }
.ii-docs-pager__link--next { text-align: right; }
.ii-docs-pager__label { font-size: 0.6875rem; color: var(--ii-on-surface-variant); text-transform: uppercase; }
.ii-docs-pager__title { font-weight: 600; color: var(--ii-primary); }
`;

/** A single documentation sidebar link. */
export interface DocsSidebarItem {
  href: string;
  label: string;
  active?: boolean;
}

/** A labeled group of sidebar links. */
export interface DocsSidebarGroup {
  group: string;
  items: DocsSidebarItem[];
}

/** A table-of-contents entry (h2 or h3 heading). */
export interface DocsTocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Props for the DocsShell layout component. */
export interface DocsShellProps {
  brand: string;
  brandHref?: string;
  navLinks?: { href: string; label: string }[];
  sidebarGroups: DocsSidebarGroup[];
  tocItems?: DocsTocItem[];
  children: any;
  themeToggle?: any;
}

/** Documentation site layout with sidebar navigation, content area, and table of contents. */
export function DocsShell({ brand, brandHref = "/", navLinks = [], sidebarGroups, tocItems = [], children, themeToggle }: DocsShellProps): any {
  injectCSS("ii-docs-shell", DOCS_CSS);
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