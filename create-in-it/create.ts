#!/usr/bin/env -S deno run -A
/**
 * create-in-it 窶・SaaS 繝励Ο繧ｸ繧ｧ繧ｯ繝育函謌・CLI
 *
 * 菴ｿ縺・婿:
 *   deno run jsr:@kotsumo/create-in-it my-saas
 *   deno run jsr:@kotsumo/create-in-it ./my-saas --template saas-starter
 */

const TEMPLATES = {
  "saas-starter": {
    name: "SaaS Starter",
    description: "邂｡逅・判髱｢ + LP + API 窶・SaaS 縺ｫ蠢・ｦ√↑繧ゅ・蜈ｨ驛ｨ蜈･繧・,
  },
};

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
};

function log(msg: string) {
  console.log(msg);
}

function success(msg: string) {
  console.log(`${COLORS.green}笨・{COLORS.reset} ${msg}`);
}

function info(msg: string) {
  console.log(`${COLORS.cyan}邃ｹ${COLORS.reset} ${msg}`);
}

function banner() {
  log("");
  log(`${COLORS.bold}${COLORS.magenta}  笊ｦ笊披風笊・  笊ｦ笊披沸笊・{COLORS.reset}`);
  log(`${COLORS.bold}${COLORS.magenta}  笊鯛舞笊鯛舞笏笏笏笊・笊・${COLORS.reset}`);
  log(`${COLORS.bold}${COLORS.magenta}  笊ｩ笊昶伏笊・  笊ｩ 笊ｩ ${COLORS.reset}`);
  log(`${COLORS.dim}  Everything is in it.${COLORS.reset}`);
  log("");
}

interface CliArgs {
  projectDir: string;
  template: string;
  help: boolean;
}

function parseArgs(args: string[]): CliArgs {
  const result: CliArgs = {
    projectDir: "",
    template: "saas-starter",
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--template" || arg === "-t") {
      result.template = args[++i] ?? "saas-starter";
    } else if (!arg.startsWith("-")) {
      result.projectDir = arg;
    }
  }

  return result;
}

function showHelp() {
  log(`
${COLORS.bold}create-in-it${COLORS.reset} 窶・SaaS 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ逕滓・

${COLORS.bold}菴ｿ縺・婿:${COLORS.reset}
  deno run jsr:@kotsumo/create-in-it <project-dir> [options]

${COLORS.bold}繧ｪ繝励す繝ｧ繝ｳ:${COLORS.reset}
  -t, --template <name>  繝・Φ繝励Ξ繝ｼ繝医ｒ謖・ｮ・(繝・ヵ繧ｩ繝ｫ繝・ saas-starter)
  -h, --help             繝倥Ν繝励ｒ陦ｨ遉ｺ

${COLORS.bold}繝・Φ繝励Ξ繝ｼ繝・${COLORS.reset}
  saas-starter           邂｡逅・判髱｢ + LP + API・医ョ繝輔か繝ｫ繝茨ｼ・
${COLORS.bold}萓・${COLORS.reset}
  deno run jsr:@kotsumo/create-in-it my-saas
  deno run jsr:@kotsumo/create-in-it ./my-app --template saas-starter
`);
}

// 繝・Φ繝励Ξ繝ｼ繝医ヵ繧｡繧､繝ｫ縺ｮ蜀・ｮｹ・医う繝ｳ繝ｩ繧､繝ｳ・・function getTemplateFiles(): Record<string, string> {
  return {
    "deno.json": JSON.stringify(
      {
        tasks: {
          dev: "deno run -A npm:vite",
          "dev:server": "deno run -A --watch server/main.ts",
          build: "deno run -A npm:vite build",
          serve: "deno serve -A server/main.ts",
        },
        compilerOptions: {
          jsx: "react-jsx",
          jsxImportSource: "hono/jsx",
        },
        imports: {
          "@kotsumo/in-it": "jsr:@kotsumo/in-it@^0.1",
          hono: "npm:hono@^4",
          "hono/jsx": "npm:hono@^4/jsx",
          "hono/jsx/dom": "npm:hono@^4/jsx/dom",
        },
        nodeModulesDir: "auto",
      },
      null,
      2,
    ),

    ".gitignore": `node_modules/
dist/
.vite/
.env
.env.local
.DS_Store
*.log
`,

    "vite.config.ts": `import { defineConfig } from "npm:vite@^6";

export default defineConfig({
  root: ".",
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "hono/jsx/dom",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  server: { port: 3000 },
  build: { outDir: "dist" },
});
`,

    "index.html": `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>My SaaS</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/client/main.tsx"></script>
</body>
</html>
`,

    "client/main.tsx": `import { render } from "hono/jsx/dom";

function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: "60px 40px", textAlign: "center" }}>
      <h1>噫 Welcome to <span style={{ color: "#6750a4" }}>in-it</span></h1>
      <p style={{ color: "#666", marginTop: "8px" }}>
        Edit <code>client/main.tsx</code> to get started.
      </p>
      <p style={{ marginTop: "24px" }}>
        <a href="https://init.dev" style={{ color: "#6750a4" }}>繝峨く繝･繝｡繝ｳ繝・/a>
      </p>
    </div>
  );
}

render(<App />, document.getElementById("app")!);
`,

    "server/main.ts": `import { Hono } from "hono";

const app = new Hono();

app.get("/api/health", (c) => c.json({ status: "ok" }));

export default app;
`,

    "README.md": `# My SaaS

> Built with [in-it](https://init.dev)

## 髢狗匱

\`\`\`bash
deno task dev     # 髢狗匱繧ｵ繝ｼ繝舌・・・MR・・deno task build   # 譛ｬ逡ｪ繝薙Ν繝・deno task serve   # 繧ｵ繝ｼ繝舌・襍ｷ蜍・\`\`\`
`,
  };
}

async function createProject(projectDir: string, _template: string) {
  const absPath = projectDir.startsWith("/") || projectDir.includes(":")
    ? projectDir
    : `${Deno.cwd()}/${projectDir}`;

  const dirName = absPath.split(/[/\\]/).pop() ?? projectDir;

  info(`繝励Ο繧ｸ繧ｧ繧ｯ繝医・{dirName}縲阪ｒ菴懈・荳ｭ...`);

  // 繝・ぅ繝ｬ繧ｯ繝医Μ菴懈・
  try {
    await Deno.mkdir(absPath, { recursive: true });
  } catch (e) {
    if (!(e instanceof Deno.errors.AlreadyExists)) throw e;
  }

  // 繝輔ぃ繧､繝ｫ譖ｸ縺崎ｾｼ縺ｿ
  const files = getTemplateFiles();
  for (const [path, content] of Object.entries(files)) {
    const fullPath = `${absPath}/${path}`;
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
    await Deno.mkdir(dir, { recursive: true });
    await Deno.writeTextFile(fullPath, content);
    success(`${path}`);
  }

  // Git 蛻晄悄蛹・  try {
    const git = new Deno.Command("git", {
      args: ["init"],
      cwd: absPath,
      stdout: "null",
      stderr: "null",
    });
    await git.output();
    success("Git 繝ｪ繝昴ず繝医Μ繧貞・譛溷喧");
  } catch {
    // git 縺檎┌縺・ｴ蜷医・繧ｹ繧ｭ繝・・
  }

  log("");
  log(`${COLORS.bold}${COLORS.green}笨ｨ 螳御ｺ・ｼ・{COLORS.reset}`);
  log("");
  log(`  ${COLORS.cyan}cd ${dirName}${COLORS.reset}`);
  log(`  ${COLORS.cyan}deno task dev${COLORS.reset}`);
  log("");
  log(`${COLORS.dim}当 https://init.dev${COLORS.reset}`);
  log("");
}

// --- Main ---
async function main() {
  const args = parseArgs(Deno.args);

  if (args.help) {
    showHelp();
    Deno.exit(0);
  }

  banner();

  if (!args.projectDir) {
    // 繧､繝ｳ繧ｿ繝ｩ繧ｯ繝・ぅ繝悶Δ繝ｼ繝・    const dir = prompt(`${COLORS.cyan}?${COLORS.reset} 繝励Ο繧ｸ繧ｧ繧ｯ繝亥錐:`) ?? "my-saas";
    args.projectDir = dir;
  }

  if (!(args.template in TEMPLATES)) {
    log(`${COLORS.yellow}笞${COLORS.reset} 繝・Φ繝励Ξ繝ｼ繝医・{args.template}縲阪′隕九▽縺九ｊ縺ｾ縺帙ｓ縲Ｔaas-starter 繧剃ｽｿ逕ｨ縺励∪縺吶Ａ);
    args.template = "saas-starter";
  }

  await createProject(args.projectDir, args.template);
}

main().catch((e) => {
  console.error(e);
  Deno.exit(1);
});
