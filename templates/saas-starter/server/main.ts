/**
 * My SaaS — Hono server
 */
import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { securityHeaders } from "./middleware/security.ts";
import { apiRoutes } from "./routes/api.ts";

const app = new Hono();

// Security middleware
app.use("*", securityHeaders());

// API routes
app.route("/api", apiRoutes);

// Static assets (production build)
app.use("/assets/*", serveStatic({ root: "./dist" }));

// SPA fallback — serves the same HTML for all client-side routes
const spaHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My SaaS</title>
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/assets/index.js"></script>
</body>
</html>`;

app.get("*", (c) => c.html(spaHtml));

export default app;
