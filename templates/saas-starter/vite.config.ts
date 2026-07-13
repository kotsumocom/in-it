import { defineConfig } from "npm:vite@^7";
import deno from "@deno/vite-plugin";
import * as path from "node:path";

export default defineConfig({
  plugins: [deno()],
  root: ".",
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "hono/jsx/dom",
  },
  resolve: {
    alias: [
      { find: "~/", replacement: path.resolve(import.meta.dirname!, "client") + "/" },
    ],
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
});
