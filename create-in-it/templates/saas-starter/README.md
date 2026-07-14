# My SaaS

> Built with [in-it](https://in-it.dev)

## Getting Started

```bash
deno task dev     # Dev server with HMR (http://localhost:5173)
deno task build   # Production build
deno task serve   # Start production server
deno task gen     # Regenerate from in-it.config.ts
```

## Project Structure

```
├── in-it.config.ts          # Project configuration
├── client/                  # Frontend (hono/jsx + in-it)
│   ├── main.tsx             # Entry point with router
│   ├── components.ts        # Auto-generated component barrel
│   ├── theme.css            # Auto-generated theme CSS
│   ├── locale-init.ts       # Auto-generated locale init
│   └── pages/
│       ├── landing.tsx      # Landing page
│       ├── auth.tsx         # Login / Signup
│       ├── terms.tsx        # Terms of Service
│       ├── privacy.tsx      # Privacy Policy
│       ├── not-found.tsx    # 404
│       ├── docs.tsx         # Documentation
│       ├── blog/
│       │   ├── index.tsx    # Blog listing
│       │   ├── post.tsx     # Blog detail
│       │   └── cms.ts       # CMS integration (Sanity/Contentful)
│       └── admin/
│           ├── dashboard.tsx  # Dashboard with charts
│           ├── settings.tsx
│           ├── users.tsx
│           ├── billing.tsx
│           └── notifications.tsx
├── server/                  # Backend (Hono)
│   ├── main.ts
│   ├── middleware/
│   │   ├── auth.ts          # Auth (plug in your provider)
│   │   └── security.ts      # CSP, CSRF headers
│   ├── routes/
│   │   └── api.ts
│   └── db/
│       ├── types.ts         # Repository interfaces
│       └── memory.ts        # In-memory (replace with your DB)
├── scripts/
│   └── gen.ts               # Code generator (called by deno task gen)
├── .agents/                 # AI assistant support
│   ├── AGENTS.md
│   └── skills/in-it/       # in-it component guide for AI
└── deno.json
```

## Configuration (`in-it.config.ts`)

All settings are optional — defaults are applied automatically.
`deno task dev` and `deno task build` run `deno task gen` automatically.

```ts
import { defineConfig } from "@kotsumo/in-it/config";

export default defineConfig({
  // Site metadata → index.html
  site: {
    name: "My SaaS",        // default: "My SaaS"
    lang: "ja",              // default: "ja"
    description: "",         // default: ""
  },

  // Theme → client/theme.css (HCT color scheme auto-generated)
  theme: {
    primary: "#6750a4",      // default: "#6750a4" (MD3 purple)
  },

  // Icon style
  icons: "outlined",         // "outlined" (default) or "filled"

  // UI locale → Japanese UI strings, Noto Sans JP, CJK typography
  locale: "ja",              // "en" (default) or "ja"

  // Auth provider (metadata only — no code generated)
  auth: {
    provider: "supabase",    // informational for AI/developers
  },

  // Component overrides → client/components.ts
  overrides: {
    Button: "./client/overrides/Button.tsx",
  },
});
```

### What `locale: "ja"` does

- All built-in component strings become Japanese (buttons, labels, aria-labels)
- Noto Sans JP is auto-loaded from Google Fonts
- Font stack: `Inter, Noto Sans JP, system-ui, sans-serif`
- Body font size: 16px (CJK optimized, up from 14px)
- Line height: 1.7 (CJK optimized)

## Component Override

To replace any in-it component with your own version:

1. Create your component in `client/overrides/`
2. Add it to `in-it.config.ts` under `overrides`
3. Run `deno task gen` (or `deno task dev`, which runs it automatically)

`client/components.ts` is auto-generated — do not edit it directly.

## Blog (Headless CMS)

The blog supports Sanity (recommended) and Contentful.
Edit `client/pages/blog/cms.ts` to connect your CMS.

## Authentication

Edit `server/middleware/auth.ts` to connect Supabase Auth, Auth0, etc.
Optionally declare `auth.provider` in `in-it.config.ts` for documentation.

## Documentation

- [in-it Docs](https://in-it.dev)
- [Hono](https://hono.dev)
- [Deno](https://deno.land)
