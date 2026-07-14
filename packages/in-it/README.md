<p align="center">
  <img src="https://raw.githubusercontent.com/kotsumocom/in-it/main/assets/logo.svg" alt="in-it" width="400" />
</p>

<p align="center">
  <strong>Everything is in it.</strong> — Hono-only dependency SaaS starter framework for Deno/Bun.
</p>

[![JSR](https://jsr.io/badges/@kotsumo/in-it)](https://jsr.io/@kotsumo/in-it)

## Features

- **Zero CSS Files** — All styles are co-located in components as string constants; no CSS imports needed
- **HCT Color System** — CAM16/HCT implementation for perceptually uniform colors
- **MD3 Theming** — Material Design 3 color scheme generation from any source color
- **WAI-ARIA Components** — Accessible interactive components (Switch, Dialog, Tabs, Menu, Toast, etc.)
- **UI Components** — Button, Card, Badge, Input, Avatar, DataTable, and more
- **Layout Components** — AdminShell, DocsShell, Landing page components
- **SVG Charts** — BarChart, LineChart, DonutChart, SparkLine (no external dependency)
- **Built-in Icons** — 5,093 Tabler-derived SVG icons (+ 1,053 filled), tree-shakeable
- **SPA Router** — Lightweight History API-based router for hono/jsx/dom
- **Markdown Parser** — Self-implemented parser with frontmatter, GFM, and TOC generation

## Install

```bash
# Deno
deno add jsr:@kotsumo/in-it

# npm (via JSR)
npx jsr add @kotsumo/in-it
```

## Quick Start

```ts
import { HctColor, generateScheme, Button, Card } from "@kotsumo/in-it";

// Generate a color scheme from a hex color
const { light, dark } = generateScheme("#6750a4");

// Use HCT color directly
const color = HctColor.fromHex("#6750a4");
console.log(color.withTone(80).toHex());
```

### CSS Setup

All component styles are bundled as string constants — no CSS file imports needed.
Call `injectStyles()` once at app startup, or use `<StyleSheet />` for SSR:

```tsx
// Option 1: Runtime injection (SPA)
import { injectStyles } from "@kotsumo/in-it/styles";
injectStyles();  // Call once at startup

// Option 2: SSR inline (recommended for Hono SSR)
import { StyleSheet } from "@kotsumo/in-it/styles";

function Layout() {
  return (
    <html>
      <head>
        <StyleSheet />
      </head>
      <body>{/* ... */}</body>
    </html>
  );
}
```

### Components

```tsx
import { Button, Card, Switch, ThemeToggle } from "@kotsumo/in-it/components";

function App() {
  return (
    <Card>
      <Button variant="filled">Click me</Button>
      <Switch label="Dark mode" />
      <ThemeToggle />
    </Card>
  );
}
```

### Project Configuration

```ts
// in-it.config.ts
import { defineConfig } from "@kotsumo/in-it/config";

export default defineConfig({
  site: { name: "My SaaS", lang: "ja" },
  theme: { primary: "#6750a4" },  // HCT color scheme auto-generated
  icons: "outlined",               // or "filled"
  locale: "ja",                    // Japanese UI + CJK typography
  overrides: {
    Button: "./client/overrides/Button.tsx",
  },
});
```

Run `deno task gen` to generate `components.ts`, `theme.css`, and `locale-init.ts`.

### Japanese UI (`locale: "ja"`)

- All component strings in Japanese (aria-labels, form labels, messages)
- Noto Sans JP auto-loaded from Google Fonts
- Font stack: `Inter, Noto Sans JP, system-ui, sans-serif`
- Body font size: 16px / Line height: 1.7 (CJK optimized)

### ARIA Helpers

```ts
import { createSwitch, createDialog } from "@kotsumo/in-it/aria";

const sw = createSwitch({ checked: false, onChange: console.log });
// Apply sw.rootProps to <button> and sw.labelProps to <label>
```

### Color Presets

```ts
import { getPresetCss, PRESETS } from "@kotsumo/in-it/color/presets";

// List available presets
console.log(PRESETS.map(p => p.name));
// ["purple", "blue", "teal", "green", "orange", "pink", "red", "indigo"]

// Generate CSS for a preset
const css = getPresetCss("purple");
```

### Markdown

```ts
import { parseMarkdown } from "@kotsumo/in-it/docs";

const { meta, html, toc } = parseMarkdown(`---
title: Hello
---
# Heading
Some **bold** text.
`);
```

### SVG Charts

```tsx
import { BarChart, LineChart, DonutChart, SparkLine } from "@kotsumo/in-it/charts";

<BarChart
  data={[{ label: "Jan", value: 100 }, { label: "Feb", value: 200 }]}
  height={200}
/>
<DonutChart
  segments={[{ label: "A", value: 60 }, { label: "B", value: 40 }]}
/>
```

### Router

```tsx
import { Route, Switch, Link } from "@kotsumo/in-it/router";

function App() {
  return (
    <div>
      <Link href="/about">About</Link>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </div>
  );
}
```

## License

MIT
