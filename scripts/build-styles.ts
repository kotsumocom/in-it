/**
 * Build script: Generates per-component CSS modules + combined styles.ts
 *
 * Output:
 *   - packages/in-it/src/css.ts  — per-component CSS string exports + base CSS setup
 *   - packages/in-it/src/styles.ts — combined CSS for backward compat (injectStyles)
 *
 * Run: deno run -A scripts/build-styles.ts
 */
import * as path from "node:path";

const CSS_DIR = path.resolve(import.meta.dirname!, "../packages/in-it/src/css");
const MAIN_CSS = path.join(CSS_DIR, "main.css");
const OUT_CSS_MODULE = path.resolve(import.meta.dirname!, "../packages/in-it/src/css.ts");
const OUT_STYLES = path.resolve(import.meta.dirname!, "../packages/in-it/src/styles.ts");

// Base CSS files (injected automatically before any component CSS)
const BASE_FILES = ["_variables.css", "_reset.css", "_icon.css", "_animations.css"];

// Read main.css and extract @import order
const mainContent = await Deno.readTextFile(MAIN_CSS);
const importRegex = /@import\s+["'](.+?)["'];/g;
const imports: string[] = [];
let match;
while ((match = importRegex.exec(mainContent)) !== null) {
  imports.push(match[1]);
}

// Read all CSS files
const cssMap = new Map<string, string>();
const allChunks: string[] = [];

for (const importPath of imports) {
  const fullPath = path.resolve(CSS_DIR, importPath);
  const filename = path.basename(importPath);
  try {
    const content = await Deno.readTextFile(fullPath);
    cssMap.set(filename, content);
    allChunks.push(content);
  } catch {
    console.warn(`Warning: Could not read ${fullPath}`);
  }
}

// Helper: escape for template literal
function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

// Helper: CSS filename → export name
// _button.css → BUTTON_CSS, _admin-shell.css → ADMIN_SHELL_CSS
function toConstName(filename: string): string {
  return filename
    .replace(/^_/, "")
    .replace(/\.css$/, "")
    .replace(/-/g, "_")
    .toUpperCase() + "_CSS";
}

// --- Generate css.ts (per-component CSS strings + base CSS setup) ---

const baseCSS = BASE_FILES.map((f) => cssMap.get(f) || "").join("\n");
const componentFiles = imports
  .map((p) => path.basename(p))
  .filter((f) => !BASE_FILES.includes(f));

let cssModuleLines = `/**
 * @module css
 * Auto-generated per-component CSS strings.
 * DO NOT EDIT — run \`deno task build:styles\` to regenerate.
 *
 * Each component imports its CSS constant and calls injectCSS().
 * Base CSS (variables, reset, animations) is auto-injected.
 */

import { setBaseCSS } from "./inject.ts";

/** Base CSS: variables + reset + icon + animations */
const BASE_CSS = \`${esc(baseCSS)}\`;

// Register base CSS for auto-injection
setBaseCSS(BASE_CSS);

`;

for (const filename of componentFiles) {
  const content = cssMap.get(filename);
  if (!content) continue;
  const constName = toConstName(filename);
  cssModuleLines += `/** CSS for ${filename.replace(/^_/, "").replace(/\.css$/, "")} */\n`;
  cssModuleLines += `export const ${constName} = \`${esc(content)}\`;\n\n`;
}

await Deno.writeTextFile(OUT_CSS_MODULE, cssModuleLines);
console.log(`✅ Generated ${OUT_CSS_MODULE} (${componentFiles.length} components)`);

// --- Generate styles.ts (backward compat) ---

const allCSS = allChunks.join("\n");
const stylesOutput = `/**
 * @module styles
 * Auto-generated from CSS component files.
 * DO NOT EDIT — run \`deno task build:styles\` to regenerate.
 *
 * Provides runtime CSS injection so in-it works without
 * any CSS file imports or build tool configuration.
 *
 * @example
 * \`\`\`tsx
 * import { injectStyles } from "@kotsumo/in-it/styles";
 *
 * // Call once at app startup
 * injectStyles();
 * \`\`\`
 *
 * Or use the component version:
 * \`\`\`tsx
 * import { StyleSheet } from "@kotsumo/in-it/styles";
 *
 * function App() {
 *   return (
 *     <>
 *       <StyleSheet />
 *       <MyApp />
 *     </>
 *   );
 * }
 * \`\`\`
 */

/** All in-it CSS as a string */
export const CSS = \`${esc(allCSS)}\`;

let injected = false;

/**
 * Inject all in-it CSS into the document head.
 * Safe to call multiple times — only injects once.
 *
 * Note: If you use per-component auto-injection (default behavior),
 * you don't need to call this function.
 */
export function injectStyles(): void {
  if (injected) return;
  if (typeof document === "undefined") return;
  injected = true;
  const style = document.createElement("style");
  style.id = "ii-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
}

/**
 * Component that injects in-it CSS on first render.
 * Place once at the top of your app.
 */
export function StyleSheet(): null {
  injectStyles();
  return null;
}
`;

await Deno.writeTextFile(OUT_STYLES, stylesOutput);
console.log(`✅ Generated ${OUT_STYLES} (${(allCSS.length / 1024).toFixed(1)} KB CSS)`);
