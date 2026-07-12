# in-it

> **Everything is in it.** — SaaS を最速で立ち上げるための統合フレームワーク

[![jsr](https://jsr.io/badges/@kotsumo/in-it)](https://jsr.io/@kotsumo/in-it)

## 🚀 クイックスタート

```bash
# プロジェクト作成
deno run jsr:@kotsumo/create-in-it my-saas
cd my-saas

# 開発開始（HMR 付き）
deno task dev
```

## ✨ 特徴

- **ワンスタック** — Hono 1 つでサーバーもクライアントも
- **ゼロ外部依存** — ARIA、ルーター、コンポーネント全て自前
- **アクセシビリティ** — WAI-ARIA APG 準拠の全コンポーネント
- **AI/LLM ネイティブ** — Deno のパーミッションモデルで安全
- **デュアルランタイム** — Deno でも Bun でも動く

## 📦 パッケージ

| パッケージ | 説明 |
|---|---|
| `@kotsumo/in-it` | コアライブラリ（コンポーネント + ARIA + CSS） |
| `@kotsumo/create-in-it` | CLI（プロジェクト生成） |

## 🧩 コンポーネント

### インタラクティブ（WAI-ARIA 準拠）

| コンポーネント | ARIA パターン |
|---|---|
| Switch | Switch |
| Dialog | Dialog (Modal) |
| Tabs | Tabs |
| Menu | Menu Button |
| Select | Listbox |
| Accordion | Accordion |
| Popover | Dialog (Non-modal) |
| Toast | Alert / Live Region |
| Tooltip | Tooltip |

### UI

Badge, Button, Card, StatCard, DataTable, Input, Avatar, Chip, Skeleton, EmptyState

### レイアウト

AdminShell（サイドバー + ツールバー + コンテンツ）

## 🛠 技術スタック

| 技術 | 役割 |
|---|---|
| [Hono](https://hono.dev) | Web フレームワーク（サーバー + クライアント JSX） |
| [hono/jsx/dom](https://hono.dev) | クライアントサイド JSX ランタイム |
| [Deno](https://deno.com) | 推奨ランタイム |
| [Vite](https://vitejs.dev) | テンプレートの HMR（Kit には含まない） |

## 📖 使い方

```typescript
import { AdminShell, Switch, Dialog, toast } from "@kotsumo/in-it/components";
import { createSwitch } from "@kotsumo/in-it/aria";
import "@kotsumo/in-it/css";
```

## 📄 ライセンス

MIT