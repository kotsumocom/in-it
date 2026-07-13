# Troubleshooting

## `@deno/vite-plugin` — npm subpath resolution bug

### Symptoms

When using `jsr:@kotsumo/in-it` with Vite via `@deno/vite-plugin`, you may see:

```
SyntaxError: '...hono/dist/index.js' does not provide an export named 'jsx'
```

### Cause

`@deno/vite-plugin` (v2.0.2 and earlier) has a bug in `resolver.js` where npm
package subpaths are stripped during resolution. For example:

- `npm:hono@^4/jsx/jsx-runtime` → resolves to `hono` (missing `/jsx/jsx-runtime`)
- Expected: `hono/jsx/jsx-runtime`

This affects any jsr package that depends on npm packages with subpath exports
(e.g., `hono/jsx`, `hono/jsx/dom`).

**Upstream issue**: https://github.com/denoland/deno-vite-plugin/issues/XXX

### Fix

Patch `node_modules/@deno/vite-plugin/dist/resolver.js`.

In the `resolveDeno()` function, find the `if (id.startsWith("npm:"))` block
(around line 80) and replace the bare-name extraction logic to preserve subpaths:

```diff
  if (id.startsWith("npm:")) {
      const bare = id.slice(4);
      let name;
      if (bare.startsWith("@")) {
          const slashIdx = bare.indexOf("/");
          const afterSlash = bare.slice(slashIdx + 1);
          const atIdx = afterSlash.indexOf("@");
-         name = atIdx === -1 ? bare : bare.slice(0, slashIdx + 1 + atIdx);
+         if (atIdx === -1) {
+             name = bare;
+         } else {
+             const pkgName = bare.slice(0, slashIdx + 1 + atIdx);
+             const afterVersion = afterSlash.slice(atIdx);
+             const subpathSlash = afterVersion.indexOf("/");
+             const subpath = subpathSlash === -1 ? "" : afterVersion.slice(subpathSlash);
+             name = pkgName + subpath;
+         }
      }
      else {
          const atIdx = bare.indexOf("@");
-         name = atIdx === -1 ? bare : bare.slice(0, atIdx);
+         if (atIdx === -1) {
+             name = bare;
+         } else {
+             const pkgName = bare.slice(0, atIdx);
+             const afterVersion = bare.slice(atIdx);
+             const subpathSlash = afterVersion.indexOf("/");
+             const subpath = subpathSlash === -1 ? "" : afterVersion.slice(subpathSlash);
+             name = pkgName + subpath;
+         }
      }
      // ...
  }
```

### Using patch-package (recommended)

```bash
# After manually editing the file above:
npx patch-package @deno/vite-plugin
```

Then add `"postinstall": "npx patch-package"` to your `package.json` scripts,
or run it via `deno task`:

```json
{
  "tasks": {
    "postinstall": "deno run -A npm:patch-package",
    "dev": "deno run -A npm:vite"
  }
}
```

### Minimal vite.config.ts

```ts
import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";

export default defineConfig({
  plugins: [deno()],
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "hono/jsx/dom",
  },
});
```
