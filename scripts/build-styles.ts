/**
 * Build script: Reads all CSS component files and generates styles.ts
 * with the concatenated CSS as a JS string constant + runtime injector.
 *
 * Run: deno run -A scripts/build-styles.ts
 */
import * as path from "node:path";

const CSS_DIR = path.resolve(import.meta.dirname!, "../packages/in-it/src/css");
const MAIN_CSS = path.join(CSS_DIR, "main.css");
const OUT_FILE = path.resolve(import.meta.dirname!, "../packages/in-it/src/styles.ts");

// Read main.css and extract @import order
const mainContent = await Deno.readTextFile(MAIN_CSS);
const importRegex = /@import\s+["'](.+?)["'];/g;
const imports: string[] = [];
let match;
while ((match = importRegex.exec(mainContent)) !== null) {
  imports.push(match[1]);
}

// Read and concatenate all CSS files in order
const cssChunks: string[] = [];
for (const importPath of imports) {
  const fullPath = path.resolve(CSS_DIR, importPath);
  try {
    const content = await Deno.readTextFile(fullPath);
    cssChunks.push(content);
  } catch {
    console.warn(`Warning: Could not read ${fullPath}`);
  }
}

const allCSS = cssChunks.join("\n");

// Escape backticks and ${} in CSS for template literal
const escaped = allCSS
  .replace(/\\/g, "\\\\")
  .replace(/`/g, "\\`")
  .replace(/\$\{/g, "\\${");

// Generate styles.ts
const output = `/**
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
export const CSS = \`${escaped}\`;

let injected = false;

/**
 * Inject all in-it CSS into the document head.
 * Safe to call multiple times — only injects once.
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

await Deno.writeTextFile(OUT_FILE, output);
console.log(`✅ Generated ${OUT_FILE} (${(allCSS.length / 1024).toFixed(1)} KB CSS)`);
