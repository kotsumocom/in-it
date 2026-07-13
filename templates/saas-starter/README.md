# My SaaS

> Built with [in-it](https://in-it.dev)

## Getting Started

```bash
deno task dev     # Dev server with HMR (http://localhost:5173)
deno task build   # Production build
deno task serve   # Start production server
```

## Project Structure

```
├── client/                  # Frontend (hono/jsx + in-it)
│   ├── main.tsx             # Entry point with router
│   ├── components.ts        # Component barrel (override here)
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
├── .agents/                 # AI assistant support
│   ├── AGENTS.md
│   └── skills/in-it/       # in-it component guide for AI
└── deno.json
```

## Component Override

To replace any in-it component with your own version:

1. Create your component in `client/overrides/`
2. Edit `client/components.ts` to swap the import

```ts
// client/components.ts
export { AdminShell } from "./overrides/AdminShell.tsx";
export * from "@kotsumo/in-it/components";
```

## Blog (Headless CMS)

The blog supports Sanity (recommended) and Contentful.
Edit `client/pages/blog/cms.ts` to connect your CMS.

## Authentication

Edit `server/middleware/auth.ts` to connect Supabase Auth, Auth0, etc.

## Documentation

- [in-it Docs](https://in-it.dev)
- [Hono](https://hono.dev)
- [Deno](https://deno.land)
