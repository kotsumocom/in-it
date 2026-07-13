/**
 * in-it Hono server
 * Admin SPA + SSR landing page + API
 */
import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

// --- API ---
app.get("/api/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

app.get("/api/stats", (c) =>
  c.json({
    mrr: 12345,
    users: 3847,
    churnRate: 1.8,
    nps: 72,
  }),
);

app.get("/api/users", (c) =>
  c.json([
    { id: "1", name: "Alice Johnson", email: "alice@example.com", plan: "Pro", status: "Active" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", plan: "Starter", status: "Active" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", plan: "Free", status: "Inactive" },
    { id: "4", name: "Diana Lee", email: "diana@example.com", plan: "Pro", status: "Active" },
    { id: "5", name: "Eric Davis", email: "eric@example.com", plan: "Starter", status: "Active" },
  ]),
);

// --- SSR: Landing Page ---
app.get("/", (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>in-it — SaaS Starter Kit</title>
  <meta name="description" content="Install in-it and get everything you need to launch a SaaS. Everything is in it." />
  <style>
    :root {
      --primary: #6750a4;
      --surface: #fef7ff;
      --on-surface: #1d1b20;
      --on-surface-variant: #49454f;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--on-surface);
      background: var(--surface);
      line-height: 1.6;
    }
    .hero {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 20px;
    }
    .hero__badge {
      display: inline-block;
      padding: 4px 16px;
      border-radius: 99px;
      background: color-mix(in srgb, var(--primary) 12%, transparent);
      color: var(--primary);
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 24px;
    }
    .hero__title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .hero__title span { color: var(--primary); }
    .hero__desc {
      font-size: 1.2rem;
      color: var(--on-surface-variant);
      max-width: 640px;
      margin-bottom: 40px;
    }
    .hero__actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 14px 32px;
      border-radius: 12px;
      font-family: inherit;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    .btn--primary { background: var(--primary); color: #fff; }
    .btn--primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn--outline { background: transparent; border: 1.5px solid var(--primary); color: var(--primary); }
    .btn--outline:hover { background: color-mix(in srgb, var(--primary) 8%, transparent); }
    .code {
      background: #1e1e2e;
      color: #cdd6f4;
      padding: 3px 10px;
      border-radius: 6px;
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1100px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    .feature {
      padding: 28px;
      border-radius: 16px;
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(0,0,0,0.06);
    }
    .feature__icon { font-size: 2rem; margin-bottom: 12px; }
    .feature__title { font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; }
    .feature__desc { color: var(--on-surface-variant); font-size: 0.95rem; }
    footer {
      text-align: center;
      padding: 40px 20px;
      color: var(--on-surface-variant);
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <section class="hero">
    <span class="hero__badge">\ud83d\ude80 v0.1 — Alpha</span>
    <h1 class="hero__title">Everything is <span>in it</span>.</h1>
    <p class="hero__desc">
      Hono + hono/jsx/dom + Deno.<br>
      Everything you need for a SaaS — admin dashboard, auth, payments, landing page, docs.
    </p>
    <div class="hero__actions">
      <a href="/admin" class="btn btn--primary">Admin Demo \u2192</a>
      <a href="https://jsr.io/@kotsumo/in-it" class="btn btn--outline">View on jsr.io</a>
    </div>
    <p style="margin-top: 32px; color: var(--on-surface-variant)">
      <code class="code">deno add @kotsumo/in-it</code>
    </p>
  </section>

  <section class="features">
    <div class="feature">
      <div class="feature__icon">\u26a1</div>
      <h3 class="feature__title">One Stack</h3>
      <p class="feature__desc">Hono handles both server and client. A unified tech stack minimizes cognitive overhead.</p>
    </div>
    <div class="feature">
      <div class="feature__icon">\u267f</div>
      <h3 class="feature__title">Accessibility</h3>
      <p class="feature__desc">WAI-ARIA APG compliant. Switch, Dialog, Tabs, Menu, Select — all components support full keyboard navigation.</p>
    </div>
    <div class="feature">
      <div class="feature__icon">\ud83e\udd16</div>
      <h3 class="feature__title">AI/LLM Native</h3>
      <p class="feature__desc">Simple mental model and Deno's permission model make it safe for AI code generation.</p>
    </div>
    <div class="feature">
      <div class="feature__icon">\ud83c\udfa8</div>
      <h3 class="feature__title">CSS Variables</h3>
      <p class="feature__desc">Sawtooth-based design tokens. Theme switching and dark mode are handled entirely through CSS variables.</p>
    </div>
    <div class="feature">
      <div class="feature__icon">\ud83d\udce6</div>
      <h3 class="feature__title">Zero External Dependencies</h3>
      <p class="feature__desc">ARIA implementation, router, components — all built from scratch. No external dependencies beyond Hono.</p>
    </div>
    <div class="feature">
      <div class="feature__icon">\ud83c\udf10</div>
      <h3 class="feature__title">Dual Runtime</h3>
      <p class="feature__desc">Runs on both Deno and Bun. Deploy to Deno Deploy with a single command.</p>
    </div>
  </section>

  <footer>
    <p>\u00a9 2026 kotsumo — in-it.dev</p>
  </footer>
</body>
</html>`;
  return c.html(html);
});

// --- Static (Vite build output) ---
app.use("/assets/*", serveStatic({ root: "./dist" }));

// --- SPA fallback: /admin/* ---
app.get("/admin/*", (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>in-it — SaaS Starter Kit</title>
  <link rel="stylesheet" href="/packages/in-it/src/css/main.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/client/main.tsx"></script>
</body>
</html>`;
  return c.html(html);
});

export default app;
