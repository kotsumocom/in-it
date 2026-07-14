/**
 * @module gen
 * Generates client/components.ts from in-it.config.ts overrides.
 *
 * Used by `deno task gen` in user projects.
 *
 * @example
 * ```ts
 * import { generateComponents } from "@kotsumo/in-it/gen";
 * await generateComponents();
 * ```
 */
import * as path from "node:path";
import * as fs from "node:fs";

/** All component names exported from @kotsumo/in-it/components */
const ALL_COMPONENTS = [
  "Badge", "Card", "Button", "StatCard", "DataTable", "Input",
  "Avatar", "Chip", "Skeleton", "EmptyState",
  "Textarea", "Alert", "Progress", "ProgressCircular",
  "Breadcrumb", "Divider", "Kbd", "Aside",
  "PricingCard", "SettingsSection", "ErrorPage",
  "BlogCard", "BlogGrid", "BlogArticle",
  "Switch", "Dialog", "Tabs", "Menu", "ToastContainer", "toast",
  "Select", "Accordion", "Popover", "ThemeToggle",
  "Combobox", "Checkbox", "RadioGroup", "Drawer",
  "Slider", "Pagination", "Steps", "Tooltip",
  "AuthForm", "UserMenu",
  "AdminShell", "DocsShell",
  "LandingHeader", "LandingHero", "LandingFeatures",
  "LandingSection", "LandingFooter",
];

const ALL_CHARTS = ["BarChart", "LineChart", "DonutChart", "SparkLine"];

/**
 * Read in-it.config.ts and generate client/components.ts.
 * @param projectRoot - Root directory of the user project. Defaults to cwd.
 */
export async function generateComponents(projectRoot?: string): Promise<void> {
  const root = projectRoot ?? process.cwd();
  const configPath = path.join(root, "in-it.config.ts");
  const outPath = path.join(root, "client", "components.ts");

  // Load config
  let overrides: Record<string, string> = {};

  if (fs.existsSync(configPath)) {
    try {
      const configModule = await import(
        `file://${configPath.replace(/\\/g, "/")}`
      );
      const config = configModule.default ?? configModule;
      overrides = config.overrides ?? {};
      console.log(
        `📋 in-it.config.ts: ${Object.keys(overrides).length} override(s)`,
      );
    } catch (e) {
      console.warn(`⚠ Could not load in-it.config.ts: ${e}`);
    }
  } else {
    console.log("📋 No in-it.config.ts found — using all defaults");
  }

  // Categorize
  const overriddenNames = new Set(Object.keys(overrides));
  const defaultComponents = ALL_COMPONENTS.filter(
    (n) => !overriddenNames.has(n),
  );
  const overriddenCharts = ALL_CHARTS.filter((n) => overriddenNames.has(n));
  const defaultCharts = ALL_CHARTS.filter((n) => !overriddenNames.has(n));

  // Generate output
  let output = `/**
 * Component barrel — auto-generated from in-it.config.ts.
 * DO NOT EDIT — run \`deno task gen\` to regenerate.
 *
 * Override components by editing in-it.config.ts:
 * @example
 * \`\`\`ts
 * import { defineConfig } from "@kotsumo/in-it/config";
 * export default defineConfig({
 *   overrides: {
 *     Button: "./client/overrides/Button.tsx",
 *   },
 * });
 * \`\`\`
 */
`;

  // Override imports
  if (overriddenNames.size > 0) {
    output += `\n// Overrides\n`;
    for (const [name, filePath] of Object.entries(overrides)) {
      const relPath = path
        .relative(path.dirname(outPath), path.resolve(root, filePath))
        .replace(/\\/g, "/");
      const prefix = relPath.startsWith(".") ? "" : "./";
      output += `export { ${name} } from "${prefix}${relPath}";\n`;
    }
  }

  // Default components
  if (defaultComponents.length > 0) {
    output += `\n// in-it defaults\n`;
    const lines: string[] = [];
    let current = "";
    for (const name of defaultComponents) {
      if (current.length + name.length + 2 > 70) {
        lines.push(current);
        current = name;
      } else {
        current = current ? `${current}, ${name}` : name;
      }
    }
    if (current) lines.push(current);
    output += `export {\n${lines.map((l) => `  ${l},`).join("\n")}\n} from "@kotsumo/in-it/components";\n`;
  }

  // Charts
  if (overriddenCharts.length > 0) {
    output += `\n// Chart overrides\n`;
    for (const name of overriddenCharts) {
      const filePath = overrides[name];
      const relPath = path
        .relative(path.dirname(outPath), path.resolve(root, filePath))
        .replace(/\\/g, "/");
      const prefix = relPath.startsWith(".") ? "" : "./";
      output += `export { ${name} } from "${prefix}${relPath}";\n`;
    }
  }
  if (defaultCharts.length > 0) {
    output += `export { ${defaultCharts.join(", ")} } from "@kotsumo/in-it/charts";\n`;
  }

  // Write
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output);

  console.log(`✅ Generated ${outPath}`);
  if (overriddenNames.size > 0) {
    console.log(`   Overrides: ${[...overriddenNames].join(", ")}`);
  }
}
