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
import { walk } from "https://deno.land/std@0.208.0/fs/walk.ts";

const PACKAGES_DIR = path.resolve(import.meta.dirname!, "../packages/in-it");
const CSS_DIR = path.resolve(PACKAGES_DIR, "src/css");
const MAIN_CSS = path.join(CSS_DIR, "main.css");
const OUT_CSS_MODULE = path.resolve(PACKAGES_DIR, "src/css.ts");
const OUT_STYLES = path.resolve(PACKAGES_DIR, "src/styles.ts");
const COMPONENTS_DIR = path.resolve(PACKAGES_DIR, "src/components");

// Base CSS files (injected automatically before any component CSS)
const BASE_FILES = ["_variables.css", "_reset.css", "_icon.css", "_animations.css"];

// --- 1. Detect colocated CSS constants in component TSX files ---
interface ColocatedCSS {
  name: string;
  filePath: string; // Absolute path
  importPath: string; // Relative path for css.ts (e.g. "./components/ui/Button.tsx")
  content: string;
}

const colocatedMap = new Map<string, ColocatedCSS>();

for await (const entry of walk(COMPONENTS_DIR, { exts: [".tsx"], includeDirs: false })) {
  const fileContent = await Deno.readTextFile(entry.path);
  const match = fileContent.match(/export\s+const\s+([A-Z0-9_]+_CSS)\s*=\s*`/);
  if (match) {
    const constName = match[1];
    // Dynamic import to get the actual CSS string value
    const fileUrl = "file:///" + entry.path.replace(/\\/g, "/");
    const module = await import(fileUrl);
    const cssContent = module[constName];

    // Compute relative import path from src/ to components/...
    const srcDir = path.resolve(PACKAGES_DIR, "src");
    let relPath = path.relative(srcDir, entry.path).replace(/\\/g, "/");
    if (!relPath.startsWith(".")) {
      relPath = "./" + relPath;
    }

    colocatedMap.set(constName, {
      name: constName,
      filePath: entry.path,
      importPath: relPath,
      content: cssContent,
    });
  }
}

console.log(`🔍 Detected ${colocatedMap.size} colocated CSS constants from TSX files.`);

// --- 2. Read main.css and extract @import order ---
const mainContent = await Deno.readTextFile(MAIN_CSS);
const importRegex = /@import\s+["'](.+?)["'];/g;
const imports: string[] = [];
let match;
while ((match = importRegex.exec(mainContent)) !== null) {
  imports.push(match[1]);
}

// --- 3. Process all chunks (read from file or use colocated constants) ---
const cssMap = new Map<string, string>();
const allChunks: string[] = [];

// Helper: CSS filename → export name
// _button.css → BUTTON_CSS
function toConstName(filename: string): string {
  return filename
    .replace(/^_/, "")
    .replace(/\.css$/, "")
    .replace(/-/g, "_")
    .toUpperCase() + "_CSS";
}

for (const importPath of imports) {
  const filename = path.basename(importPath);
  const constName = toConstName(filename);

  // Check if we have a colocated version first
  const colocated = colocatedMap.get(constName);
  if (colocated) {
    cssMap.set(filename, colocated.content);
    allChunks.push(colocated.content);
    continue;
  }

  // Fallback to reading file
  const fullPath = path.resolve(CSS_DIR, importPath);
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

// --- 4. Generate css.ts (supporting both raw string exports and re-exports) ---
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
  const constName = toConstName(filename);
  const colocated = colocatedMap.get(constName);

  cssModuleLines += `/** CSS for ${filename.replace(/^_/, "").replace(/\.css$/, "")} */\n`;
  if (colocated) {
    // Output re-export
    cssModuleLines += `export { ${constName} } from "${colocated.importPath}";\n\n`;
  } else {
    // Output raw string literal
    const content = cssMap.get(filename) || "";
    cssModuleLines += `export const ${constName} = \`${esc(content)}\`;\n\n`;
  }
}

await Deno.writeTextFile(OUT_CSS_MODULE, cssModuleLines);
console.log(`✅ Generated ${OUT_CSS_MODULE} (${componentFiles.length} components)`);

// --- 5. Generate styles.ts (combined CSS for backward compat) ---
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

