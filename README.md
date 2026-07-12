# in-it

> **Everything is in it.** — SaaS を最速で立ち上げるための統合フレームワーク

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## 🚀 クイックスタート

```bash
deno add @kotsumo/in-it
```

```typescript
import { Button, Card, ThemeToggle } from "@kotsumo/in-it";
```

```html
<link rel="stylesheet" href="@kotsumo/in-it/src/css/main.css" />
```

## ✨ 特徴

- **ワンスタック** — Hono 1 つでサーバーもクライアントも
- **ゼロ外部依存** — ARIA、ルーター、カラーシステム、Markdown パーサー全て自前
- **50+ コンポーネント** — フォーム、フィードバック、ナビゲーション、レイアウト
- **HCT カラー** — Material Design 3 互換、プリセット 1 つでライト/ダーク対応
- **ARIA 準拠** — WAI-ARIA APG 準拠のインタラクティブコンポーネント
- **デュアルランタイム** — Deno でも Bun でも動作

## 🧩 コンポーネント

### インタラクティブ（WAI-ARIA 準拠）

| コンポーネント | ARIA パターン |
|---|---|
| Switch | Switch |
| Dialog | Dialog (Modal) |
| Tabs | Tabs |
| Menu | Menu Button |
| Select | Listbox |
| Combobox | Combobox |
| Accordion | Accordion |
| Popover | Dialog (Non-modal) |
| Toast | Alert / Live Region |
| Checkbox | Checkbox |
| RadioGroup | Radio Group |
| Drawer | Dialog (Non-modal) |
| ThemeToggle | Switch |

### フォーム

Input, Textarea, NumberInput, PasswordInput, TagsInput, FileUpload, Slider, RatingGroup, Editable, Toggle, PinInput

### UI

Button, Badge, Card, StatCard, DataTable, Avatar, Chip, Skeleton, EmptyState, Divider, Kbd, Alert, Progress, ProgressCircular, Breadcrumb, Aside

### レイアウト

AdminShell, DocsShell, LandingHeader, LandingHero, LandingFeatures, LandingSection, LandingFooter

## 🎨 HCT カラーシステム

Material Design 3 互換の HCT (Hue-Chroma-Tone) カラーシステムを自前実装（ゼロ外部依存）。

```typescript
import { HctColor, generateScheme, getPresetCss } from "@kotsumo/in-it";

// プリセットで簡単に
const css = getPresetCss("teal");

// カスタムカラーで
const { light, dark } = generateScheme("#6750a4");

// HCT で色操作
const color = HctColor.fromHex("#1565c0");
const lighter = color.withTone(80); // Tone 80 に変更
```

プリセット: `purple`, `blue`, `teal`, `green`, `orange`, `pink`, `red`, `indigo`

## 📖 ドキュメント

自前 Markdown パーサー搭載（JSON Frontmatter、TOC 自動生成、Aside/Callout 対応）:

```markdown
---json
{
  "title": "Button",
  "description": "ボタンコンポーネント"
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

## 📄 ライセンス

[MIT](./LICENSE)