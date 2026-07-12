#!/usr/bin/env -S deno run -A
/**
 * create-in-it  ESaaS プロジェクト生戁ECLI
 *
 * 使ぁE��:
 *   deno run jsr:@kotsumo/create-in-it my-saas
 *   deno run jsr:@kotsumo/create-in-it ./my-saas --template saas-starter
 */

const TEMPLATES = {
  "saas-starter": {
    name: "SaaS Starter",
    description: "管琁E��面 + LP + API  ESaaS に忁E��なも�E全部入めE,
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
  console.log(`${COLORS.green}✁E{COLORS.reset} ${msg}`);
}

function info(msg: string) {
  console.log(`${COLORS.cyan}ℹ${COLORS.reset} ${msg}`);
}

function banner() {
  log("");
  log(`${COLORS.bold}${COLORS.magenta}  ╦╔╗╁E  ╦╔╦╁E{COLORS.reset}`);
  log(`${COLORS.bold}${COLORS.magenta}  ║║║║───╁E╁E${COLORS.reset}`);
  log(`${COLORS.bold}${COLORS.magenta}  ╩╝╚╁E  ╩ ╩ ${COLORS.reset}`);
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
${COLORS.bold}create-in-it${COLORS.reset}  ESaaS プロジェクトを生�E

${COLORS.bold}使ぁE��:${COLORS.reset}
  deno run jsr:@kotsumo/create-in-it <project-dir> [options]

${COLORS.bold}オプション:${COLORS.reset}
  -t, --template <name>  チE��プレートを持E��E(チE��ォルチE saas-starter)
  -h, --help             ヘルプを表示

${COLORS.bold}チE��プレーチE${COLORS.reset}
  saas-starter           管琁E��面 + LP + API�E�デフォルト！E
${COLORS.bold}侁E${COLORS.reset}
  deno run jsr:@kotsumo/create-in-it my-saas
  deno run jsr:@kotsumo/create-in-it ./my-app --template saas-starter
`);
}

// チE��プレートファイルの冁E���E�インライン�E�Efunction getTemplateFiles(): Record<string, string> {
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
      <h1>🚀 Welcome to <span style={{ color: "#6750a4" }}>in-it</span></h1>
      <p style={{ color: "#666", marginTop: "8px" }}>
        Edit <code>client/main.tsx</code> to get started.
      </p>
      <p style={{ marginTop: "24px" }}>
        <a href="https://in-it.dev" style={{ color: "#6750a4" }}>ドキュメンチE/a>
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

> Built with [in-it](https://in-it.dev)

## 開発

\`\`\`bash
deno task dev     # 開発サーバ�E�E�EMR�E�Edeno task build   # 本番ビルチEdeno task serve   # サーバ�E起勁E\`\`\`
`,
  };
}

async function createProject(projectDir: string, _template: string) {
  const absPath = projectDir.startsWith("/") || projectDir.includes(":")
    ? projectDir
    : `${Deno.cwd()}/${projectDir}`;

  const dirName = absPath.split(/[/\\]/).pop() ?? projectDir;

  info(`プロジェクト、E{dirName}」を作�E中...`);

  // チE��レクトリ作�E
  try {
    await Deno.mkdir(absPath, { recursive: true });
  } catch (e) {
    if (!(e instanceof Deno.errors.AlreadyExists)) throw e;
  }

  // ファイル書き込み
  const files = getTemplateFiles();
  for (const [path, content] of Object.entries(files)) {
    const fullPath = `${absPath}/${path}`;
    const dir = fullPath.substring(0, fullPath.lastIndexOf("/"));
    await Deno.mkdir(dir, { recursive: true });
    await Deno.writeTextFile(fullPath, content);
    success(`${path}`);
  }

  // Git 初期匁E  try {
    const git = new Deno.Command("git", {
      args: ["init"],
      cwd: absPath,
      stdout: "null",
      stderr: "null",
    });
    await git.output();
    success("Git リポジトリを�E期化");
  } catch {
    // git が無ぁE��合�EスキチE�E
  }

  log("");
  log(`${COLORS.bold}${COLORS.green}✨ 完亁E��E{COLORS.reset}`);
  log("");
  log(`  ${COLORS.cyan}cd ${dirName}${COLORS.reset}`);
  log(`  ${COLORS.cyan}deno task dev${COLORS.reset}`);
  log("");
  log(`${COLORS.dim}📖 https://in-it.dev${COLORS.reset}`);
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
    // インタラクチE��ブモーチE    const dir = prompt(`${COLORS.cyan}?${COLORS.reset} プロジェクト名:`) ?? "my-saas";
    args.projectDir = dir;
  }

  if (!(args.template in TEMPLATES)) {
    log(`${COLORS.yellow}⚠${COLORS.reset} チE��プレート、E{args.template}」が見つかりません。saas-starter を使用します。`);
    args.template = "saas-starter";
  }

  await createProject(args.projectDir, args.template);
}

main().catch((e) => {
  console.error(e);
  Deno.exit(1);
});
