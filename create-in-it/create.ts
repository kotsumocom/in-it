#!/usr/bin/env -S deno run -A
/**
 * create-in-it — SaaS project scaffolding CLI
 *
 * Works with Deno and Bun.
 *
 * Usage:
 *   deno run -A jsr:@kotsumo/create-in-it my-saas
 *   bunx jsr:@kotsumo/create-in-it my-saas
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

// ============================================================
// Config
// ============================================================

const TEMPLATE_DIR = path.resolve(import.meta.dirname!, "templates/saas-starter");

type Bundler = "vite" | "esbuild" | "none";

const BUNDLER_CHOICES: { value: Bundler; label: string; default?: boolean }[] = [
  { value: "vite", label: "Vite (recommended)", default: true },
  { value: "esbuild", label: "esbuild" },
  { value: "none", label: "None (manual setup)" },
];

// Files to skip copying (generated per-bundler)
const SKIP_FILES = new Set(["deno.json", "vite.config.ts"]);

// ============================================================
// Colors & logging
// ============================================================

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

const log = (m: string) => console.log(m);
const ok = (m: string) => console.log(`${C.green}✓${C.reset} ${m}`);
const info = (m: string) => console.log(`${C.cyan}ℹ${C.reset} ${m}`);
const warn = (m: string) => console.log(`${C.yellow}⚠${C.reset} ${m}`);
const fail = (m: string) => {
  console.error(`${C.red}✗${C.reset} ${m}`);
  process.exit(1);
};

function banner() {
  log("");
  log(`${C.bold}${C.magenta}  ╦╔╗═  ╦╔╦═${C.reset}`);
  log(`${C.bold}${C.magenta}  ║║║║───═ ═${C.reset}`);
  log(`${C.bold}${C.magenta}  ╩╝╚═  ╩ ╩ ${C.reset}`);
  log(`${C.dim}  Everything is in it.${C.reset}`);
  log("");
}

// ============================================================
// CLI args
// ============================================================

interface Args {
  projectDir: string;
  bundler: Bundler;
  help: boolean;
}

function parseArgs(raw: string[]): Args {
  const args: Args = { projectDir: "", bundler: "vite", help: false };
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    if (a === "-h" || a === "--help") args.help = true;
    else if (a === "-b" || a === "--bundler") {
      const v = raw[++i] as Bundler;
      if (["vite", "esbuild", "none"].includes(v)) args.bundler = v;
      else warn(`Unknown bundler "${v}", using vite.`);
    } else if (!a.startsWith("-")) args.projectDir = a;
  }
  return args;
}

function showHelp() {
  log(`
${C.bold}create-in-it${C.reset} — Generate a SaaS project

${C.bold}Usage:${C.reset}
  deno run -A jsr:@kotsumo/create-in-it <project-dir> [options]
  bunx jsr:@kotsumo/create-in-it <project-dir> [options]

${C.bold}Options:${C.reset}
  -b, --bundler <name>  Build tool: vite (default), esbuild, none
  -h, --help            Show help

${C.bold}Examples:${C.reset}
  deno run -A jsr:@kotsumo/create-in-it my-saas
  deno run -A jsr:@kotsumo/create-in-it ./my-app --bundler esbuild
`);
}

// ============================================================
// Cross-runtime helpers
// ============================================================

function getCliArgs(): string[] {
  // Deno: Deno.args, Bun/Node: process.argv.slice(2)
  if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.args;
  return process.argv.slice(2);
}

function getCwd(): string {
  if (typeof globalThis.Deno !== "undefined") return globalThis.Deno.cwd();
  return process.cwd();
}

// ============================================================
// Prompt helpers (cross-runtime)
// ============================================================

let rl: ReturnType<typeof createInterface> | null = null;

function getRL() {
  if (!rl) rl = createInterface({ input: stdin, output: stdout });
  return rl;
}

function closeRL() {
  if (rl) { rl.close(); rl = null; }
}

async function ask(question: string): Promise<string> {
  return await getRL().question(question);
}

async function promptText(question: string, fallback: string): Promise<string> {
  const ans = await ask(`${C.cyan}?${C.reset} ${question} ${C.dim}(${fallback})${C.reset} `);
  return ans.trim() || fallback;
}

async function promptChoice<T extends string>(
  question: string,
  choices: { value: T; label: string; default?: boolean }[],
): Promise<T> {
  log(`${C.cyan}?${C.reset} ${question}`);
  for (let i = 0; i < choices.length; i++) {
    const ch = choices[i];
    const marker = ch.default ? `${C.green}❯${C.reset}` : " ";
    log(`  ${marker} ${C.bold}${i + 1}${C.reset}) ${ch.label}`);
  }
  const defaultIdx = choices.findIndex((c) => c.default);
  const ans = await ask(`  ${C.dim}Enter choice (1-${choices.length})${C.reset} `);
  const idx = parseInt(ans) - 1;
  if (idx >= 0 && idx < choices.length) return choices[idx].value;
  return choices[defaultIdx >= 0 ? defaultIdx : 0].value;
}

// ============================================================
// File copy (recursive)
// ============================================================

async function copyTemplateFiles(
  srcDir: string,
  destDir: string,
): Promise<void> {
  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      // Skip .agents directory
      if (entry.name === ".agents") continue;

      await fs.mkdir(destPath, { recursive: true });
      await copyTemplateFiles(srcPath, destPath);
    } else if (entry.isFile()) {
      const rel = path.relative(TEMPLATE_DIR, srcPath).replace(/\\/g, "/");
      if (SKIP_FILES.has(rel)) continue;

      await fs.copyFile(srcPath, destPath);
      ok(rel);
    }
  }
}

// ============================================================
// Bundler-specific config generation
// ============================================================

function generateDenoJson(bundler: Bundler): string {
  const base: Record<string, unknown> = {
    compilerOptions: {
      jsx: "react-jsx",
      jsxImportSource: "hono/jsx",
    },
    imports: {
      "~/": "./client/",
      "@kotsumo/in-it": "jsr:@kotsumo/in-it@^0.4",
      "@kotsumo/in-it/components": "jsr:@kotsumo/in-it@^0.4/components",
      "@kotsumo/in-it/charts": "jsr:@kotsumo/in-it@^0.4/charts",
      "@kotsumo/in-it/icons": "jsr:@kotsumo/in-it@^0.4/icons",
      "@kotsumo/in-it/router": "jsr:@kotsumo/in-it@^0.4/router",
      "@kotsumo/in-it/styles": "jsr:@kotsumo/in-it@^0.4/styles",
      hono: "npm:hono@^4",
      "hono/jsx": "npm:hono@^4/jsx",
      "hono/jsx/dom": "npm:hono@^4/jsx/dom",
    },
    nodeModulesDir: "auto",
  };

  switch (bundler) {
    case "vite":
      base.imports = {
        ...(base.imports as Record<string, string>),
        vite: "npm:vite@^7",
        "@deno/vite-plugin": "npm:@deno/vite-plugin",
      };
      base.tasks = {
        dev: "deno run -A npm:vite",
        "dev:server": "deno run -A --watch server/main.ts",
        build: "deno run -A npm:vite build",
        serve: "deno serve -A server/main.ts",
      };
      break;

    case "esbuild":
      base.imports = {
        ...(base.imports as Record<string, string>),
        esbuild: "npm:esbuild@^0.24",
      };
      base.tasks = {
        dev: "deno run -A build.ts --watch",
        "dev:server": "deno run -A --watch server/main.ts",
        build: "deno run -A build.ts",
        serve: "deno serve -A server/main.ts",
      };
      break;

    case "none":
      base.tasks = {
        "dev:server": "deno run -A --watch server/main.ts",
        serve: "deno serve -A server/main.ts",
      };
      break;
  }

  return JSON.stringify(base, null, 2) + "\n";
}

function generateEsbuildConfig(): string {
  return `import * as esbuild from "esbuild";

const isWatch = Deno.args.includes("--watch");

const config: esbuild.BuildOptions = {
  entryPoints: ["client/main.tsx"],
  bundle: true,
  outdir: "dist/assets",
  format: "esm",
  splitting: true,
  minify: !isWatch,
  sourcemap: isWatch,
  jsx: "automatic",
  jsxImportSource: "hono/jsx/dom",
  loader: { ".tsx": "tsx", ".ts": "ts" },
  target: ["es2022"],
  define: {
    "import.meta.env.DEV": isWatch ? "true" : "false",
  },
};

if (isWatch) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log("\\x1b[32m✓\\x1b[0m Watching for changes...");
  await new Promise(() => {});
} else {
  await esbuild.build(config);
  console.log("\\x1b[32m✓\\x1b[0m Build complete → dist/assets/");
  process.exit(0);
}
`;
}

// ============================================================
// Project creation
// ============================================================

async function createProject(
  projectDir: string,
  bundler: Bundler,
) {
  const absPath = path.isAbsolute(projectDir)
    ? projectDir
    : path.resolve(getCwd(), projectDir);
  const dirName = path.basename(absPath);

  // Check if directory exists and is non-empty
  if (existsSync(absPath)) {
    const entries = await fs.readdir(absPath);
    if (entries.length > 0) {
      warn(`Directory "${dirName}" is not empty.`);
      const cont = await ask(`${C.cyan}?${C.reset} Continue anyway? (y/N) `);
      if (cont.toLowerCase() !== "y") process.exit(0);
    }
  }

  info(`Creating project "${dirName}" with ${bundler}...`);
  log("");

  await fs.mkdir(absPath, { recursive: true });

  // 1. Copy template files (excludes deno.json, vite.config.ts, .agents/)
  await copyTemplateFiles(TEMPLATE_DIR, absPath);
  log("");

  // 2. Generate deno.json for selected bundler
  await fs.writeFile(
    path.join(absPath, "deno.json"),
    generateDenoJson(bundler),
  );
  ok(`deno.json (${bundler})`);

  // 3. Bundler-specific files
  switch (bundler) {
    case "vite": {
      await fs.copyFile(
        path.join(TEMPLATE_DIR, "vite.config.ts"),
        path.join(absPath, "vite.config.ts"),
      );
      ok("vite.config.ts");
      break;
    }

    case "esbuild": {
      await fs.writeFile(
        path.join(absPath, "build.ts"),
        generateEsbuildConfig(),
      );
      ok("build.ts");
      break;
    }

    case "none":
      info("No build tool configured. Set up your preferred bundler manually.");
      break;
  }

  // 4. Git init
  try {
    execSync("git init", { cwd: absPath, stdio: "ignore" });
    ok("Initialized Git repository");
  } catch {
    // git not available
  }

  // 5. Install dependencies
  log("");
  info("Installing dependencies...");
  const runtime = typeof globalThis.Deno !== "undefined" ? "deno" : "bun";
  try {
    execSync(`${runtime} install`, { cwd: absPath, stdio: "inherit" });
    ok("Dependencies installed");
  } catch {
    warn(`${runtime} install failed. Run manually: ${runtime} install`);
  }

  // Done!
  log("");
  log(`${C.bold}${C.green}✨ Done!${C.reset}`);
  log("");
  log(`  ${C.cyan}cd ${dirName}${C.reset}`);
  if (bundler !== "none") {
    log(`  ${C.cyan}${runtime} task dev${C.reset}`);
  }
  log("");
  log(`${C.dim}📖 https://in-it.dev${C.reset}`);
  log("");
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = parseArgs(getCliArgs());

  if (args.help) {
    showHelp();
    process.exit(0);
  }

  banner();

  // Project name
  if (!args.projectDir) {
    args.projectDir = await promptText("Project name:", "my-saas");
  }

  // Bundler (interactive if not specified via flag)
  if (!getCliArgs().some((a) => a === "-b" || a === "--bundler")) {
    args.bundler = await promptChoice("Build tool:", BUNDLER_CHOICES);
  }

  log("");
  await createProject(args.projectDir, args.bundler);
  closeRL();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
