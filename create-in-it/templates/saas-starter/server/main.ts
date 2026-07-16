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

/**
 * Read the Vite manifest to resolve the entry JS/CSS filenames.
 */
function readManifest(): { js: string; css: string[] } {
  try {
    const raw = Deno.readTextFileSync("./dist/.vite/manifest.json");
    const manifest = JSON.parse(raw);
    const entry = manifest["client/main.tsx"];
    return {
      js: `/${entry.file}`,
      css: (entry.css ?? []).map((f: string) => `/${f}`),
    };
  } catch {
    return { js: "/assets/index.js", css: [] };
  }
}

const { js, css } = readManifest();
const cssLinks = css.map((href: string) =>
  `<link rel="stylesheet" href="${href}" />`
).join("\n  ");

// SPA fallback — serves the same HTML for all client-side routes
app.get("*", (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My SaaS</title>
  ${cssLinks}
</head>
<body>
  <div id="app"></div>
  <script type="module" src="${js}"></script>
</body>
</html>`;
  return c.html(html);
});

export default app;
