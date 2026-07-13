# My SaaS

> A SaaS application built with [in-it](https://in-it.dev)

## Development

```bash
# Start dev server with HMR
deno task dev

# Production build
deno task build

# Start server
deno task serve
```

## Structure

```
├── client/          # Admin dashboard SPA (hono/jsx/dom)
├── server/          # Hono API server
├── deno.json        # Configuration
└── vite.config.ts   # Vite config (HMR)
```

## Tech Stack

- **[in-it](https://in-it.dev)** — SaaS starter kit
- **[Hono](https://hono.dev)** — Web framework
- **[Deno](https://deno.com)** — Runtime
