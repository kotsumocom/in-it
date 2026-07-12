/**
 * Theme CSS generation CLI
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
  console.log("  --preset=<name>    Use a preset color");
  console.log("  --primary=#RRGGBB  Custom primary color");
  console.log("  --output=<file>    Output file (default: stdout)");
  console.log("");
  console.log(`Available presets: ${getPresetNames().join(", ")}`);
  if (typeof Deno !== "undefined") Deno.exit(0);
  else process.exit(0);
}

let css: string;

if (args.preset) {
  css = getPresetCss(args.preset);
  console.log(`✅ Preset "${args.preset}" theme generated`);
} else {
  css = generateCss(args.primary);
  console.log(`✅ Custom color ${args.primary}  theme generated`);
}

if (args.output) {
  if (typeof Deno !== "undefined") {
    await Deno.writeTextFile(args.output, css);
  } else {
    const fs = await import("node:fs");
    fs.writeFileSync(args.output, css);
  }
  console.log(`📝 ${args.output}  written`);
} else {
  console.log(css);
}
