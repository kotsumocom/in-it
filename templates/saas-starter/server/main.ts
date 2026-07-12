/**
 * My SaaS — Hono サーバー
 */
import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

// API
app.get("/api/health", (c) => c.json({ status: "ok" }));

// Static assets
app.use("/assets/*", serveStatic({ root: "./dist" }));

// SPA fallback
app.get("/admin/*", (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My SaaS</title>
  <link rel="stylesheet" href="/packages/in-it/src/css/main.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/client/main.tsx"></script>
</body>
</html>`);
});

export default app;
