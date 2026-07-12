# My SaaS

> [in-it](https://in-it.ooo) で構築された SaaS アプリケーション。

## 開発

```bash
# 開発サーバー起動（HMR 付き）
deno task dev

# 本番ビルド
deno task build

# サーバー起動
deno task serve
```

## 構成

```
├── client/          # 管理画面 SPA（hono/jsx/dom）
├── server/          # Hono API サーバー
├── deno.json        # 設定
└── vite.config.ts   # Vite 設定（HMR）
```

## 技術スタック

- **[in-it](https://in-it.ooo)** — SaaS スターターキット
- **[Hono](https://hono.dev)** — Web フレームワーク
- **[Deno](https://deno.com)** — ランタイム
