/**
 * @module gen
 * Code generator for in-it projects.
 * Reads in-it.config.ts and generates:
 * - client/components.ts (component barrel with overrides)
 * - client/theme.css (HCT color scheme from primary color)
 * - Updates index.html (site name, lang, description)
 *
 * @example
 * ```ts
 * import { generateComponents } from "@kotsumo/in-it/gen";
 * await generateComponents();
 * ```
 */
import * as path from "node:path";
import * as fs from "node:fs";
import type { InItConfig } from "./config.ts";
import { defaults } from "./config.ts";
import { generateCss } from "./color/scheme.ts";

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
 * Load in-it.config.ts from project root.
 */
async function loadConfig(root: string): Promise<InItConfig> {
  const configPath = path.join(root, "in-it.config.ts");
  if (!fs.existsSync(configPath)) {
    console.log("📋 No in-it.config.ts found — using all defaults");
    return {};
  }
  try {
    const mod = await import(`file://${configPath.replace(/\\/g, "/")}`);
    const config: InItConfig = mod.default ?? mod;
    console.log("📋 Loaded in-it.config.ts");
    return config;
  } catch (e) {
    console.warn(`⚠ Could not load in-it.config.ts: ${e}`);
    return {};
  }
}

/**
 * Generate client/components.ts from overrides config.
 */
function genComponents(root: string, config: InItConfig): void {
  const outPath = path.join(root, "client", "components.ts");
  const overrides = config.overrides ?? {};
  const overriddenNames = new Set(Object.keys(overrides));
  const defaultComponents = ALL_COMPONENTS.filter(
    (n) => !overriddenNames.has(n),
  );
  const overriddenCharts = ALL_CHARTS.filter((n) => overriddenNames.has(n));
  const defaultCharts = ALL_CHARTS.filter((n) => !overriddenNames.has(n));

  let output = `/**
 * Component barrel — auto-generated from in-it.config.ts.
 * DO NOT EDIT — run \`deno task gen\` to regenerate.
 */
`;

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

  if (overriddenCharts.length > 0) {
    output += `\n// Chart overrides\n`;
    for (const name of overriddenCharts) {
      const filePath = overrides[name as keyof typeof overrides]!;
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

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output);

  if (overriddenNames.size > 0) {
    console.log(
      `✅ components.ts — ${overriddenNames.size} override(s): ${[...overriddenNames].join(", ")}`,
    );
  } else {
    console.log("✅ components.ts — all defaults");
  }
}

/**
 * Generate client/theme.css from theme config.
 */
function genTheme(root: string, config: InItConfig): void {
  const primary = config.theme?.primary ?? defaults.theme.primary;
  const locale = config.locale ?? defaults.locale;
  const outPath = path.join(root, "client", "theme.css");

  const css = generateCss(primary);

  // CJK typography optimizations
  const cjkCss = locale === "ja"
    ? `\n/* CJK typography optimizations (locale: ja) */\n:root {\n  --ii-font-family: 'Inter', 'Noto Sans JP', system-ui, sans-serif;\n  --ii-body-md: 1rem;\n  --ii-body-line-height: 1.7;\n}\nbody {\n  line-height: var(--ii-body-line-height);\n}\n`
    : "";

  const output = `/**\n * Theme CSS — auto-generated from in-it.config.ts.\n * DO NOT EDIT — run \\\`deno task gen\\\` to regenerate.\n *\n * Primary: ${primary}\n * Locale: ${locale}\n */\n${css}${cjkCss}`;

  fs.writeFileSync(outPath, output);
  console.log(`✅ theme.css — primary: ${primary}, locale: ${locale}`);
}

/**
 * Update index.html with site config.
 */
function genIndexHtml(root: string, config: InItConfig): void {
  const htmlPath = path.join(root, "index.html");
  if (!fs.existsSync(htmlPath)) return;

  const site = { ...defaults.site, ...config.site };
  let html = fs.readFileSync(htmlPath, "utf-8");

  // Update lang
  html = html.replace(
    /(<html\s+)lang="[^"]*"/,
    `$1lang="${site.lang}"`,
  );

  // Update title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${site.name}</title>`,
  );

  // Update or add meta description
  if (site.description) {
    if (html.includes('name="description"')) {
      html = html.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
        `<meta name="description" content="${site.description}" />`,
      );
    } else {
      html = html.replace(
        "</head>",
        `  <meta name="description" content="${site.description}" />\n</head>`,
      );
    }
  }

  // Add Google Fonts link for Japanese locale
  const locale = config.locale ?? defaults.locale;
  if (locale === "ja" && !html.includes("Noto+Sans+JP")) {
    const fontLink = `  <link rel="preconnect" href="https://fonts.googleapis.com" />\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />`;
    html = html.replace(
      "</head>",
      `${fontLink}\n</head>`,
    );
  }

  fs.writeFileSync(htmlPath, html);
  console.log(`✅ index.html — "${site.name}" (${site.lang})`);
}

/**
 * Generate client/locale-init.ts from locale config.
 */
function genLocaleInit(root: string, config: InItConfig): void {
  const locale = config.locale ?? defaults.locale;
  const outPath = path.join(root, "client", "locale-init.ts");

  const output = `/**
 * Locale initialization — auto-generated from in-it.config.ts.
 * DO NOT EDIT — run \`deno task gen\` to regenerate.
 */
import { setLocale } from "@kotsumo/in-it/locale";
setLocale("${locale}");
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output);
  console.log(`✅ locale-init.ts — ${locale}`);
}

/**
 * Run all generators.
 * @param projectRoot - Root directory of the user project. Defaults to cwd.
 */
export async function generateComponents(
  projectRoot?: string,
): Promise<void> {
  const root = projectRoot ?? process.cwd();
  console.log("🔧 in-it gen\n");

  const config = await loadConfig(root);

  genComponents(root, config);
  genTheme(root, config);
  genIndexHtml(root, config);
  genLocaleInit(root, config);

  console.log("\n✨ Done!");
}
