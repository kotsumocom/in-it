import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import * as path from "node:path";
import * as fs from "node:fs";

const __dirname = import.meta.dirname!;

// --- @deno/vite-plugin npm subpath bug fix ---
// See: https://in-it.dev/docs/troubleshooting
const resolverPath = path.resolve(
  __dirname,
  "node_modules/@deno/vite-plugin/dist/resolver.js",
);
try {
  let code = fs.readFileSync(resolverPath, "utf-8");
  if (!code.includes("subpathSlash")) {
    const bugNonScoped =
      `name = atIdx === -1 ? bare : bare.slice(0, atIdx);`;
    const fixNonScoped = `name = (() => {
                if (atIdx === -1) return bare;
                const pkgName = bare.slice(0, atIdx);
                const afterVersion = bare.slice(atIdx);
                const subpathSlash = afterVersion.indexOf("/");
                return subpathSlash === -1 ? pkgName : pkgName + afterVersion.slice(subpathSlash);
            })();`;
    const bugScoped =
      `name = atIdx === -1 ? bare : bare.slice(0, slashIdx + 1 + atIdx);`;
    const fixScoped = `name = (() => {
                if (atIdx === -1) return bare;
                const pkgName = bare.slice(0, slashIdx + 1 + atIdx);
                const afterVersion = afterSlash.slice(atIdx);
                const subpathSlash = afterVersion.indexOf("/");
                return subpathSlash === -1 ? pkgName : pkgName + afterVersion.slice(subpathSlash);
            })();`;
    code = code.replace(bugNonScoped, fixNonScoped);
    code = code.replace(bugScoped, fixScoped);
    fs.writeFileSync(resolverPath, code);
    console.log("✓ @deno/vite-plugin patched (npm subpath fix).");
  }
} catch {
  // Plugin not installed or already patched — skip
}
// --- End patch ---

export default defineConfig({
  plugins: [deno()],
  root: ".",
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "hono/jsx/dom",
  },
  resolve: {
    alias: [
      { find: "~/", replacement: path.resolve(__dirname, "client") + "/" },
    ],
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  server: { port: 3000 },
  build: {
    outDir: "dist",
    manifest: true,
    rollupOptions: {
      input: path.resolve(__dirname, "client/main.tsx"),
    },
  },
});
