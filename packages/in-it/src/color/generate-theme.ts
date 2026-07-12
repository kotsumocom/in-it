/**
 * テーマ CSS 生成 CLI
 *
 * Usage:
 *   deno run generate-theme.ts --preset=purple --output=theme.css
 *   deno run generate-theme.ts --primary=#6750a4 --output=theme.css
 *   bun run generate-theme.ts --preset=teal
 */
import { generateCss } from "./scheme.ts";
import { getPresetCss, getPresetNames, getPreset } from "./presets.ts";

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const arg of args) {
    const match = arg.match(/^--(\w[\w-]*)=(.+)$/);
    if (match) result[match[1]] = match[2];
  }
  return result;
}

const args = parseArgs(typeof Deno !== "undefined" ? Deno.args : process.argv.slice(2));

if (!args.preset && !args.primary) {
  console.log("Usage:");
  console.log("  --preset=<name>    プリセットカラー名");
  console.log("  --primary=#RRGGBB  カスタムプライマリカラー");
  console.log("  --output=<file>    出力ファイル（省略時は stdout）");
  console.log("");
  console.log(`利用可能なプリセット: ${getPresetNames().join(", ")}`);
  if (typeof Deno !== "undefined") Deno.exit(0);
  else process.exit(0);
}

let css: string;

if (args.preset) {
  css = getPresetCss(args.preset);
  console.log(`✅ プリセット「${args.preset}」のテーマを生成`);
} else {
  css = generateCss(args.primary);
  console.log(`✅ カスタムカラー ${args.primary} のテーマを生成`);
}

if (args.output) {
  if (typeof Deno !== "undefined") {
    await Deno.writeTextFile(args.output, css);
  } else {
    const fs = await import("node:fs");
    fs.writeFileSync(args.output, css);
  }
  console.log(`📝 ${args.output} に書き出しました`);
} else {
  console.log(css);
}
