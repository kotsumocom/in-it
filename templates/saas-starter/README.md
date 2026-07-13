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
├── client/              # Frontend (hono/jsx + in-it components)
│   ├── main.tsx         # Entry point with router
│   └── pages/
│       ├── landing.tsx  # Landing page
│       ├── auth.tsx     # Login / Signup
│       ├── terms.tsx    # Terms of Service
│       ├── privacy.tsx  # Privacy Policy
│       ├── not-found.tsx
│       └── admin/
│           ├── dashboard.tsx
│           ├── settings.tsx
│           ├── users.tsx
│           └── billing.tsx
├── server/              # Backend (Hono)
│   ├── main.ts          # Server entry
│   ├── middleware/
│   │   ├── auth.ts      # Auth middleware (plug in your provider)
│   │   └── security.ts  # CSP, CSRF headers
│   ├── routes/
│   │   └── api.ts       # API endpoints
│   └── db/
│       ├── types.ts     # Repository interfaces
│       └── memory.ts    # In-memory implementation (replace with your DB)
├── deno.json
├── vite.config.ts
└── index.html
```

## Authentication

The auth UI is ready to use. To connect it to a real auth provider:

1. Install your provider (e.g. `@supabase/supabase-js`)
2. Update `server/middleware/auth.ts` with your auth logic
3. Update `client/pages/auth.tsx` to call your provider's API

See the [in-it docs](https://in-it.dev) for more details.

## Database

The template uses a Repository pattern with an in-memory implementation.
To switch to a real database:

1. Implement the interfaces in `server/db/types.ts`
2. Replace the import in `server/routes/api.ts`

## Documentation

- [in-it Docs](https://in-it.dev)
- [Hono](https://hono.dev)
- [Deno](https://deno.land)
