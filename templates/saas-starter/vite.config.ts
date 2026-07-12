import { defineConfig } from "npm:vite@^6";
import * as path from "node:path";

export default defineConfig({
  root: ".",
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "hono/jsx/dom",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
});
