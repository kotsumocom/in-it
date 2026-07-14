import { t } from "../../locale.ts";
import { injectCSS } from "../../inject.ts";

/** @internal CSS for Breadcrumb — co-located for self-containment. */
export const BREADCRUMB_CSS = `/* --- Breadcrumb --- */
.ii-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: var(--ii-font-sm); }
.ii-breadcrumb__item { color: var(--ii-on-surface-variant); text-decoration: none; }
.ii-breadcrumb__item:hover { color: var(--ii-primary); }
.ii-breadcrumb__item--current { color: var(--ii-on-surface); font-weight: 500; }
.ii-breadcrumb__sep { color: var(--ii-outline); font-size: 0.7rem; }
`;

/** A single breadcrumb navigation item. */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Props for the Breadcrumb component. */
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
}

/** Breadcrumb navigation trail with customizable separator. */
export function Breadcrumb({ items, separator = "/" }: BreadcrumbProps): any {
  injectCSS("ii-breadcrumb", BREADCRUMB_CSS);
  return (
    <nav class="ii-breadcrumb" aria-label={t("breadcrumb")}>
      <ol class="ii-breadcrumb__list" style={{ display: "flex", alignItems: "center", gap: "8px", listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item, i) => (
          <li key={i} class="ii-breadcrumb__item" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {item.href
              ? <a href={item.href} class="ii-breadcrumb__link" style={{ color: "inherit", textDecoration: "none" }}>{item.label}</a>
              : <span class="ii-breadcrumb__current" aria-current="page">{item.label}</span>}
            {i < items.length - 1 && <span class="ii-breadcrumb__sep" aria-hidden="true">{separator}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
