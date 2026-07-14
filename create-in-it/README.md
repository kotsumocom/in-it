# create-in-it

Scaffold a SaaS project with [in-it](https://in-it.dev) — Hono + Deno/Bun.

## Usage

```bash
# Deno
deno run -A jsr:@kotsumo/create-in-it my-saas

# Bun
bunx jsr:@kotsumo/create-in-it my-saas
```

## Options

```
-b, --bundler <name>  Build tool: vite (default), esbuild, none
-h, --help            Show help
```

## What you get

- **Landing page** — hero, features, pricing, CTA
- **Admin dashboard** — charts, tables, sidebar navigation
- **Auth pages** — login, signup with localized UI
- **Blog** — headless CMS integration (Sanity/Contentful)
- **Docs page** — markdown-based documentation
- **API server** — Hono with security middleware
- **50+ components** — buttons, cards, dialogs, tables, and more
- **`in-it.config.ts`** — centralized project configuration

## Configuration

After scaffolding, customize your project in `in-it.config.ts`:

```ts
import { defineConfig } from "@kotsumo/in-it/config";

export default defineConfig({
  site: { name: "My SaaS", lang: "ja" },
  theme: { primary: "#ff5722" },
  locale: "ja",  // Japanese UI + CJK typography
  overrides: {
    Button: "./client/overrides/Button.tsx",
  },
});
```

Run `deno task gen` to apply changes. `deno task dev` runs it automatically.

## Build tool selection

The app code is **shared across all build tools**. Only the build config differs:

| Bundler | Files generated |
|---------|----------------|
| Vite (default) | `vite.config.ts` + `deno.json` |
| esbuild | `build.ts` + `deno.json` |
| None | `deno.json` only |

## License

MIT
