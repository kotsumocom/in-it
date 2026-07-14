/**
 * CSS 移動スクリプト
 * css.ts から指定された CSS 定数を抽出し、対象コンポーネントファイルに挿入する。
 * css.ts 側は re-export に置き換える。
 *
 * Usage: deno run -A scripts/move-css.ts <CSS_CONST_NAME> <component_path_relative_to_src>
 * Example: deno run -A scripts/move-css.ts ACCORDION_CSS components/interactive/Accordion.tsx
 */

const [cssName, componentRelPath] = Deno.args;
if (!cssName || !componentRelPath) {
  console.error("Usage: deno run -A scripts/move-css.ts <CSS_CONST_NAME> <component_path_relative>");
  Deno.exit(1);
}

const srcDir = new URL("../packages/in-it/src/", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const cssPath = `${srcDir}css.ts`;
const componentPath = `${srcDir}${componentRelPath}`;

// Read files
const cssContent = await Deno.readTextFile(cssPath);
const componentContent = await Deno.readTextFile(componentPath);

// Extract CSS constant from css.ts
// Pattern: export const ACCORDION_CSS = `...`;
const exportPattern = new RegExp(
  `(/\\*\\*[^]*?\\*/\\n)?export const ${cssName} = \`([^]*?)\`;`,
  "m"
);
const match = cssContent.match(exportPattern);
if (!match) {
  console.error(`❌ Could not find 'export const ${cssName}' in css.ts`);
  Deno.exit(1);
}
const fullMatch = match[0];
const cssBody = match[2]; // Content inside backticks

console.log(`✅ Found ${cssName} (${cssBody.length} chars)`);

// 1. Add CSS constant to component file
// Remove the old import line: import { XXXX_CSS } from "../../css.ts";
// or update it to remove just this constant

const importPattern = new RegExp(
  `import \\{ ${cssName} \\} from "[^"]*css\\.ts";\\n?`
);
const multiImportPattern = new RegExp(
  `import \\{ ([^}]*?)${cssName}([^}]*?) \\} from "[^"]*css\\.ts";`
);

let newComponentContent: string;

if (importPattern.test(componentContent)) {
  // Single import — remove the line entirely
  newComponentContent = componentContent.replace(importPattern, "");
} else if (multiImportPattern.test(componentContent)) {
  // Multi import — remove just this constant from the import
  newComponentContent = componentContent.replace(multiImportPattern, (_m, before, after) => {
    const remaining = (before + after)
      .replace(/,\s*,/g, ",")
      .replace(/^[\s,]+/, "")
      .replace(/[\s,]+$/, "")
      .trim();
    // Find the import source path
    const sourceMatch = componentContent.match(new RegExp(`import \\{[^}]*${cssName}[^}]*\\} from "([^"]*css\\.ts)"`));
    const source = sourceMatch ? sourceMatch[1] : "../../css.ts";
    return remaining ? `import { ${remaining} } from "${source}";` : "";
  });
} else {
  console.error(`⚠️ No import of ${cssName} found in component — CSS will be added but import not removed`);
  newComponentContent = componentContent;
}

// Insert CSS constant after imports (after the last import line)
const lastImportIdx = newComponentContent.lastIndexOf("\nimport ");
const insertAfterImports = lastImportIdx >= 0
  ? newComponentContent.indexOf("\n", lastImportIdx + 1)
  : -1;

const cssConstant = `\n/** @internal CSS — co-located for self-containment. */\nexport const ${cssName} = \`${cssBody}\`;\n`;

if (insertAfterImports >= 0) {
  // Find the end of the import line
  const nextLineEnd = newComponentContent.indexOf("\n", insertAfterImports + 1);
  // Insert after last import
  newComponentContent = 
    newComponentContent.slice(0, insertAfterImports + 1) + 
    cssConstant +
    newComponentContent.slice(insertAfterImports + 1);
} else {
  // No imports found, prepend
  newComponentContent = cssConstant + "\n" + newComponentContent;
}

// 2. Replace CSS in css.ts with re-export
const reExport = `export { ${cssName} } from "./${componentRelPath}";\n`;
const newCssContent = cssContent.replace(fullMatch, reExport);

// Write files
await Deno.writeTextFile(componentPath, newComponentContent);
await Deno.writeTextFile(cssPath, newCssContent);

console.log(`✅ Moved ${cssName} to ${componentRelPath}`);
console.log(`✅ css.ts updated with re-export`);
