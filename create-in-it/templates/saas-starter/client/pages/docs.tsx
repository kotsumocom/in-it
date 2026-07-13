/**
 * Docs page — uses DocsShell with sidebar navigation and markdown content.
 */
import { DocsShell } from "~/components.ts";
import type { DocsSidebarGroup } from "@kotsumo/in-it/components";

const SIDEBAR: DocsSidebarGroup[] = [
  {
    label: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs", active: true },
      { label: "Installation", href: "/docs/installation" },
      { label: "Quick Start", href: "/docs/quickstart" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Button", href: "/docs/components/button" },
      { label: "Card", href: "/docs/components/card" },
      { label: "Dialog", href: "/docs/components/dialog" },
      { label: "DataTable", href: "/docs/components/datatable" },
      { label: "Charts", href: "/docs/components/charts" },
    ],
  },
  {
    label: "Layouts",
    items: [
      { label: "Admin Shell", href: "/docs/layouts/admin" },
      { label: "Landing Page", href: "/docs/layouts/landing" },
      { label: "Docs Shell", href: "/docs/layouts/docs" },
      { label: "Auth Page", href: "/docs/layouts/auth" },
    ],
  },
  {
    label: "Guides",
    items: [
      { label: "Theming", href: "/docs/guides/theming" },
      { label: "Authentication", href: "/docs/guides/auth" },
      { label: "Database", href: "/docs/guides/database" },
      { label: "Deployment", href: "/docs/guides/deployment" },
    ],
  },
];

const TOC = [
  { label: "Overview", href: "#overview", level: 2 },
  { label: "Features", href: "#features", level: 2 },
  { label: "Tech Stack", href: "#tech-stack", level: 2 },
  { label: "Next Steps", href: "#next-steps", level: 2 },
];

export function DocsPage() {
  return (
    <DocsShell
      brand="My SaaS Docs"
      sidebarGroups={SIDEBAR}
      toc={TOC}
    >
      <h1>Introduction</h1>
      <p>
        Welcome to the My SaaS documentation. This guide covers everything you need to
        know to build, customize, and deploy your SaaS application.
      </p>

      <h2 id="overview">Overview</h2>
      <p>
        My SaaS is built on top of the <strong>in-it</strong> framework, a Hono-only SaaS
        starter that provides components, layouts, charts, and utilities — all with zero
        external dependencies beyond Hono.
      </p>

      <h2 id="features">Features</h2>
      <ul>
        <li><strong>50+ Components</strong> — Buttons, forms, tables, dialogs, charts, and more</li>
        <li><strong>Admin Dashboard</strong> — Ready-to-use admin shell with sidebar navigation</li>
        <li><strong>Authentication UI</strong> — Login/signup forms with OAuth support</li>
        <li><strong>Dark Mode</strong> — Automatic light/dark mode with HCT color system</li>
        <li><strong>Blog</strong> — Headless CMS integration (Sanity, Contentful)</li>
        <li><strong>Charts</strong> — SVG charts (bar, line, donut, sparkline) with zero dependencies</li>
        <li><strong>WAI-ARIA</strong> — Accessible components following ARIA guidelines</li>
      </ul>

      <h2 id="tech-stack">Tech Stack</h2>
      <table class="ii-data-table">
        <thead>
          <tr><th>Layer</th><th>Technology</th></tr>
        </thead>
        <tbody>
          <tr><td>Runtime</td><td>Deno / Bun</td></tr>
          <tr><td>Framework</td><td>Hono</td></tr>
          <tr><td>UI</td><td>hono/jsx + in-it components</td></tr>
          <tr><td>Styling</td><td>in-it CSS (BEM, CSS variables)</td></tr>
          <tr><td>Bundler</td><td>Vite (dev), esbuild (prod)</td></tr>
        </tbody>
      </table>

      <h2 id="next-steps">Next Steps</h2>
      <p>Ready to start? Head to the <a href="/docs/installation">Installation</a> guide.</p>
    </DocsShell>
  );
}
