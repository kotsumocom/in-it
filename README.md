# in-it

> **Everything is in it.** — SaaS を最速で立ち上げるための統合フレームワーク

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink?style=flat)](https://github.com/sponsors/kotsumocom)

🌐 [公式サイト](https://in-it.dev) · 📖 [ドキュメント](https://in-it.dev/docs) · 🎨 [カラープレビュー](https://in-it.dev/colors)

## 🚀 クイックスタート

```bash
deno add @kotsumo/in-it
```

```typescript
import { Button, Card, ThemeToggle, Dialog } from "@kotsumo/in-it";
```

```html
<link rel="stylesheet" href="@kotsumo/in-it/src/css/main.css" />
```

## ✨ 特徴

| | 特徴 | 説明 |
|---|---|---|
| ⚡ | **ワンスタック** | Hono 1 つでサーバーもクライアントも |
| 🚫 | **ゼロ外部依存** | ARIA、ルーター、HCT カラー、Markdown パーサー全て自前 |
| 🧩 | **50+ コンポーネント** | フォーム、フィードバック、ナビゲーション、レイアウト |
| 🎨 | **HCT カラー** | Material Design 3 互換、プリセット 1 つでライト/ダーク対応 |
| ♿ | **ARIA 準拠** | WAI-ARIA APG 準拠のインタラクティブコンポーネント |
| 🔄 | **デュアルランタイム** | Deno でも Bun でも動作 |

## 🧩 コンポーネント

### インタラクティブ（WAI-ARIA 準拠）

| コンポーネント | ARIA パターン | 説明 |
|---|---|---|
| Switch | Switch | トグルスイッチ |
| Dialog | Dialog (Modal) | モーダルダイアログ、フォーカストラップ |
| Tabs | Tabs | タブ切替、矢印キー操作 |
| Menu | Menu Button | ドロップダウンメニュー |
| Select | Listbox | セレクトボックス |
| Combobox | Combobox | 検索付きセレクト |
| Accordion | Accordion | 折りたたみパネル |
| Popover | Dialog (Non-modal) | ポップオーバー |
| Toast | Alert / Live Region | 通知トースト |
| Checkbox | Checkbox | チェックボックス |
| RadioGroup | Radio Group | ラジオボタングループ |
| Drawer | Dialog (Non-modal) | サイドドロワー |
| ThemeToggle | Switch | ライト/ダーク切替 |
| Tooltip | Tooltip | ツールチップ |
| Slider | Slider | レンジスライダー |
| Pagination | — | ページネーション |
| Steps | — | ステップインジケーター |

### フォーム

Input, Textarea, NumberInput, PasswordInput, TagsInput, FileUpload, Slider, RatingGroup, Editable, Toggle, PinInput

### UI

Button, Badge, Card, StatCard, DataTable, Avatar, Chip, Skeleton, EmptyState, Divider, Kbd, Alert, Progress, ProgressCircular, Breadcrumb, Aside

### レイアウト

| コンポーネント | 用途 |
|---|---|
| AdminShell | サイドバー + ツールバー + コンテンツの管理画面 |
| DocsShell | サイドバー + コンテンツ + TOC のドキュメントサイト |
| LandingHeader / Hero / Features / Section / Footer | LP 構築用パーツ |

## 🎨 HCT カラーシステム

Material Design 3 互換の HCT (Hue-Chroma-Tone) カラーシステムを**ゼロ外部依存**で自前実装。

```typescript
import { HctColor, generateScheme, getPresetCss } from "@kotsumo/in-it";

// プリセットで簡単に
const css = getPresetCss("teal");

// カスタムカラーでスキーム生成
const { light, dark } = generateScheme("#6750a4");

// HCT で直接色操作
const color = HctColor.fromHex("#1565c0");
const lighter = color.withTone(80).toHex();
```

### プリセットカラー

| プリセット | Hex | 用途 |
|---|---|---|
| `purple` | `#6750a4` | デフォルト。落ち着いた印象 |
| `blue` | `#1565c0` | ビジネス系 |
| `teal` | `#00695c` | ヘルスケア、環境系 |
| `green` | `#2e7d32` | 成功、成長系 |
| `orange` | `#e65100` | エネルギッシュ |
| `pink` | `#c2185b` | クリエイティブ系 |
| `red` | `#c62828` | アラート、緊急系 |
| `indigo` | `#283593` | テクノロジー系 |

## 📖 ドキュメントシステム

自前 Markdown パーサー搭載（JSON Frontmatter、TOC 自動生成、Aside/Callout 対応）:

```markdown
---json
{
  "title": "Button",
  "description": "ボタンコンポーネント",
  "sidebar_label": "Button",
  "sidebar_position": 1
}
---

# Button

> [!TIP]
> in-it は Deno と Bun の両方で動作します。
```

## 🛠 技術スタック

| 技術 | 役割 |
|---|---|
| [Hono](https://hono.dev) | Web フレームワーク（サーバー + クライアント JSX） |
| [Deno](https://deno.com) / [Bun](https://bun.sh) | ランタイム |
| [Vite](https://vitejs.dev) | 開発時 HMR |

## 📦 CSS クラス命名規則

全クラスは `ii-` プレフィックスで BEM に準拠:

```css
.ii-button          /* Block */
.ii-button__icon    /* Element */
.ii-button--filled  /* Modifier */
```

## 📄 ライセンス

[MIT](./LICENSE)

## ❤️ Sponsors

in-it の開発を応援していただける方を募集しています！

[See our sponsors →](./SPONSORS.md)

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-pink?style=for-the-badge)](https://github.com/sponsors/kotsumocom)