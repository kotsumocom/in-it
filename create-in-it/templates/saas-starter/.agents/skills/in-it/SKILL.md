---
name: in-it
description: |
  in-it — Hono-only SaaS starter framework for Deno/Bun.
  HCT color system, WAI-ARIA components, MD3 theming, built-in icons (Tabler),
  SPA router, markdown parser, SVG charts, and admin/LP/docs/auth layouts.
  Zero external dependencies beyond Hono.
---

# in-it Component Guide

## Installation

```bash
deno add @kotsumo/in-it
```

## CSS

```tsx
// Import all styles (recommended)
import "@kotsumo/in-it/css/main.css";
```

## Import Pattern

Always import from the local barrel for override support:

```tsx
import { Button, Card, AdminShell } from "~/components.ts";
```

The `~/components.ts` file re-exports everything from `@kotsumo/in-it/components` and `@kotsumo/in-it/charts`. To override a component, modify this file.

## Component Categories

### Layout Components

| Component | Usage | CSS Prefix |
|-----------|-------|------------|
| `<AdminShell>` | Admin dashboard shell | `ii-admin-*` |
| `<DocsShell>` | Documentation site | `ii-docs-*` |
| `<LandingHeader>` | LP header | `ii-lp-header*` |
| `<LandingHero>` | LP hero section | `ii-lp-hero*` |
| `<LandingFeatures>` | LP features grid | `ii-lp-features*` |
| `<LandingSection>` | LP generic section | `ii-lp-section*` |
| `<LandingFooter>` | LP footer | `ii-lp-footer*` |

### UI Components

| Component | Usage |
|-----------|-------|
| `<Button>` | Primary actions (variants: filled, outlined, text, tonal) |
| `<Card>` | Content container |
| `<Badge>` | Status indicator |
| `<StatCard>` | Metric display with trend |
| `<DataTable>` | Sortable data table |
| `<PricingCard>` | Pricing plan card |
| `<ErrorPage>` | Error page (404, 500, etc.) |
| `<SettingsSection>` | Settings page 2-column layout |

### Interactive Components

| Component | Usage |
|-----------|-------|
| `<AuthForm>` | Login/signup form with OAuth |
| `<UserMenu>` | Avatar dropdown menu |
| `<Dialog>` | Modal dialog |
| `<Tabs>` | Tab navigation |
| `<Select>` | Dropdown select |
| `<Accordion>` | Expandable sections |
| `<Toast>`, `<ToastContainer>` | Notifications |
| `<Switch>` | Toggle switch |
| `<ThemeToggle>` | Dark/light mode toggle |
| `<Menu>` | Context/dropdown menu |
| `<Tooltip>` | Hover tooltip |
| `<Combobox>` | Searchable select |
| `<Steps>` | Step indicator |

### Chart Components

| Component | Usage |
|-----------|-------|
| `<BarChart>` | Bar chart (SVG, zero-dependency) |
| `<LineChart>` | Line chart with optional area fill |
| `<DonutChart>` | Donut/pie chart with legend |
| `<SparkLine>` | Inline mini chart for stat cards |

### Form Components

| Component | Usage |
|-----------|-------|
| Input | Use `<input class="ii-input">` with `<div class="ii-input-field">` wrapper |
| `<Checkbox>` | Checkbox |
| `<RadioGroup>` | Radio button group |
| `<Slider>` | Range slider |
| `<Textarea>` | Multi-line text input |

### Icons

```tsx
import { Icon } from "@kotsumo/in-it/icons";

<Icon name="settings" size={20} />
```

Icons are derived from Tabler Icons. Use `name` prop with kebab-case icon names.

## CSS Architecture

### Naming Convention

- Prefix: `ii-` (in-it)
- Convention: BEM (`ii-block__element--modifier`)
- CSS variables: `--ii-*`

### Theme Customization

Override CSS variables:

```css
:root {
  --ii-primary: #2563eb;
  --ii-primary-container: #dbeafe;
}
```

### Dark Mode

```html
<html data-theme="dark">  <!-- Force dark -->
<html data-theme="light"> <!-- Force light -->
<html>                     <!-- Follow OS preference -->
```

## Page Structure CSS Classes

| Class | Usage |
|-------|-------|
| `ii-admin-page__header` | Page header with title + actions |
| `ii-admin-page__title` | Page title |
| `ii-admin-page__desc` | Page description |
| `ii-admin-page__actions` | Action buttons area |
| `ii-stat-grid` | Auto-fit grid for StatCards |
| `ii-placeholder` | Empty state placeholder box |
| `ii-auth-page` | Full-screen centered auth layout |
| `ii-legal-page` | Legal page container (terms, privacy) |
| `ii-notification-list` | Notification item list |
| `ii-blog-grid` | Blog card grid |
| `ii-blog-card` | Blog post card |
| `ii-pricing-grid` | Pricing card grid |
| `ii-settings-section__row` | Inline label + control row |

## Rules

- **NEVER use inline styles** (`style={{ ... }}`). Use in-it CSS classes only.
- **NEVER add external CSS dependencies**. in-it CSS should handle all styling.
- Import components from `~/components.ts`, not directly from `@kotsumo/in-it/components`.
- Use `<Icon name="..." />` for all icons. Do not use emoji or external icon libraries.
- Follow the BEM naming convention for any custom CSS classes.

## Component Override

To override a component, edit `client/components.ts`:

```ts
// Override AdminShell
export { AdminShell } from "./overrides/AdminShell.tsx";

// Keep everything else
export {
  Button, Card, Badge, // ...etc
} from "@kotsumo/in-it/components";
```

See `references/components.md` for full Props documentation.
