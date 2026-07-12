/**
 * in-it  EHono サーバ�E
 * 管琁E��面 SPA + SSR ペ�Eジ + API
 */
import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const app = new Hono();

// --- API ---
app.get("/api/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

app.get("/api/stats", (c) =>
  c.json({
    mrr: 1234567,
    users: 3847,
    churnRate: 1.8,
    nps: 72,
  }),
);

app.get("/api/users", (c) =>
  c.json([
    { id: "1", name: "田中 太郁E, email: "tanaka@example.com", plan: "Pro", status: "アクチE��チE },
    { id: "2", name: "佐藤 花孁E, email: "sato@example.com", plan: "Starter", status: "アクチE��チE },
    { id: "3", name: "鈴木 一郁E, email: "suzuki@example.com", plan: "Free", status: "無効" },
    { id: "4", name: "高橁E美咲", email: "takahashi@example.com", plan: "Pro", status: "アクチE��チE },
    { id: "5", name: "伊藤 健太", email: "ito@example.com", plan: "Starter", status: "アクチE��チE },
  ]),
);

// --- SSR: LP ---
app.get("/", (c) => {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>in-it  ESaaS Starter Kit</title>
  <meta name="description" content="in-it をインスト�Eルするだけで SaaS を始める�Eに忁E��なも�Eが揃ぁE��Everything is in it." />
  <style>
    :root {
      --primary: #6750a4;
      --surface: #fef7ff;
      --on-surface: #1d1b20;
      --on-surface-variant: #49454f;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: var(--on-surface);
      background: var(--surface);
      line-height: 1.6;
    }
    .hero {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px 20px;
    }
    .hero__badge {
      display: inline-block;
      padding: 4px 16px;
      border-radius: 99px;
      background: color-mix(in srgb, var(--primary) 12%, transparent);
      color: var(--primary);
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 24px;
    }
    .hero__title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.1;
      margin-bottom: 16px;
    }
    .hero__title span { color: var(--primary); }
    .hero__desc {
      font-size: 1.2rem;
      color: var(--on-surface-variant);
      max-width: 640px;
      margin-bottom: 40px;
    }
    .hero__actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 14px 32px;
      border-radius: 12px;
      font-family: inherit;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    .btn--primary { background: var(--primary); color: #fff; }
    .btn--primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn--outline { background: transparent; border: 1.5px solid var(--primary); color: var(--primary); }
    .btn--outline:hover { background: color-mix(in srgb, var(--primary) 8%, transparent); }
    .code {
      background: #1e1e2e;
      color: #cdd6f4;
      padding: 3px 10px;
      border-radius: 6px;
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      max-width: 1100px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    .feature {
      padding: 28px;
      border-radius: 16px;
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(0,0,0,0.06);
    }
    .feature__icon { font-size: 2rem; margin-bottom: 12px; }
    .feature__title { font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; }
    .feature__desc { color: var(--on-surface-variant); font-size: 0.95rem; }
    footer {
      text-align: center;
      padding: 40px 20px;
      color: var(--on-surface-variant);
      font-size: 0.85rem;
    }
  </style>
</head>
<body>
  <section class="hero">
    <span class="hero__badge">🚀 v0.1  EAlpha</span>
    <h1 class="hero__title">Everything is <span>in it</span>.</h1>
    <p class="hero__desc">
      Hono + hono/jsx/dom + Deno、Ebr>
      SaaS に忁E��なも�E全部入り。管琁E��面、認証、決済、LP、ドキュメント、E    </p>
    <div class="hero__actions">
      <a href="/admin" class="btn btn--primary">管琁E��面チE�� ↁE/a>
      <a href="https://jsr.io/@kotsumo/in-it" class="btn btn--outline">jsr.io で見る</a>
    </div>
    <p style="margin-top: 32px; color: var(--on-surface-variant)">
      <code class="code">deno add @kotsumo/in-it</code>
    </p>
  </section>

  <section class="features">
    <div class="feature">
      <div class="feature__icon">⚡</div>
      <h3 class="feature__title">ワンスタチE��</h3>
      <p class="feature__desc">Hono 1 つでサーバ�Eもクライアントも。技術スタチE��の統一で認知負荷を最小化、E/p>
    </div>
    <div class="feature">
      <div class="feature__icon">♿</div>
      <h3 class="feature__title">アクセシビリチE��</h3>
      <p class="feature__desc">WAI-ARIA APG 準拠。Switch, Dialog, Tabs, Menu, Select  E全コンポ�Eネントがキーボ�Eド操作対応、E/p>
    </div>
    <div class="feature">
      <div class="feature__icon">🤁E/div>
      <h3 class="feature__title">AI/LLM ネイチE��チE/h3>
      <p class="feature__desc">シンプルなメンタルモチE��、Eeno のパ�EミッションモチE��で安�E、EI がコード生成しめE��ぁE��計、E/p>
    </div>
    <div class="feature">
      <div class="feature__icon">🎨</div>
      <h3 class="feature__title">CSS 変数設訁E/h3>
      <p class="feature__desc">Sawtooth ベ�EスのチE��イント�Eクン。テーマ�E替もダークモードも CSS 変数で完結、E/p>
    </div>
    <div class="feature">
      <div class="feature__icon">📦</div>
      <h3 class="feature__title">ゼロ外部依孁E/h3>
      <p class="feature__desc">ARIA 実裁E��ルーター、コンポ�EネンチE E全て自前、Eono 以外�E外部依存なし、E/p>
    </div>
    <div class="feature">
      <div class="feature__icon">🌐</div>
      <h3 class="feature__title">チE��アルランタイム</h3>
      <p class="feature__desc">Deno でめEBun でも動く、Eeno Deploy で 1 コマンドデプロイ、E/p>
    </div>
  </section>

  <footer>
    <p>© 2026 kotsumo  Ein-it.dev</p>
  </footer>
</body>
</html>`;
  return c.html(html);
});

// --- Static (Vite build output) ---
app.use("/assets/*", serveStatic({ root: "./dist" }));

// --- SPA fallback: /admin/* ---
app.get("/admin/*", (c) => {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>in-it  ESaaS Starter Kit</title>
  <link rel="stylesheet" href="/packages/in-it/src/css/main.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/client/main.tsx"></script>
</body>
</html>`;
  return c.html(html);
});

export default app;
