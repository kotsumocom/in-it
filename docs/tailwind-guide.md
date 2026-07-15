# Tailwind CSS 併用ガイド

in-it フレームワークと Tailwind CSS を併用するための設定ガイドです。

## なぜ併用できるのか

in-it と Tailwind CSS は以下の理由で自然に共存できます:

1. **プレフィックスが衝突しない** — in-it は `ii-` プレフィックス (BEM 規約) を使い、Tailwind はプレフィックスなし
2. **CSS 変数を共有できる** — Tailwind のテーマで in-it のデザイントークンを参照可能
3. **ダークモード自動対応** — Tailwind が in-it の CSS 変数を参照するため、テーマ切替で色も自動的に変わる

## 3 層アーキテクチャ

in-it は 3 層のスタイリングアプローチを推奨します:

| レイヤー | 担当 | 例 |
|---|---|---|
| **Layer 1: in-it コンポーネント** | UI の基本構成要素 | `<Button>`, `<Card>`, `<PageHeader>`, `<Grid>` |
| **Layer 2: Tailwind CSS** | 特殊レイアウトやユーティリティ | `flex`, `gap-4`, `text-primary` |
| **Layer 3: カスタム CSS** | 完全にカスタムな UI | `pm-receipt-crop`, BEM 規約 (`app-*` プレフィックス) |

**原則**: Layer 1 で対応できるものは in-it コンポーネントを使い、Layer 2 / 3 はそのコンポーネントでカバーできない場合にのみ使用します。

## セットアップ

### 1. Tailwind CSS のインストール

```bash
# Vite プロジェクトの場合
deno install npm:tailwindcss npm:@tailwindcss/vite
```

### 2. tailwind.config.ts

```ts
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/**/*.{tsx,ts,html}"],

  // in-it の CSS Reset と衝突しないように Preflight を無効化
  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      // in-it のデザイントークンを Tailwind カラーとして利用
      colors: {
        primary: "var(--ii-primary)",
        "on-primary": "var(--ii-on-primary)",
        "primary-container": "var(--ii-primary-container)",
        secondary: "var(--ii-secondary)",
        surface: "var(--ii-surface)",
        "surface-container": "var(--ii-surface-container)",
        "on-surface": "var(--ii-on-surface)",
        "on-surface-variant": "var(--ii-on-surface-variant)",
        error: "var(--ii-error)",
        success: "var(--ii-success)",
        warning: "var(--ii-warning)",
        outline: "var(--ii-outline)",
        "outline-variant": "var(--ii-outline-variant)",
      },

      // in-it のスペーシングトークン
      spacing: {
        "ii-1": "var(--ii-spacing-1)",  // 4px
        "ii-2": "var(--ii-spacing-2)",  // 8px
        "ii-3": "var(--ii-spacing-3)",  // 12px
        "ii-4": "var(--ii-spacing-4)",  // 16px
        "ii-5": "var(--ii-spacing-5)",  // 20px
        "ii-6": "var(--ii-spacing-6)",  // 24px
      },

      // in-it のボーダーラジウス
      borderRadius: {
        "ii-sm": "var(--ii-shape-sm)",
        "ii-md": "var(--ii-shape-md)",
        "ii-lg": "var(--ii-shape-lg)",
        "ii-full": "var(--ii-shape-full)",
      },

      // in-it のフォントサイズ
      fontSize: {
        "ii-sm": "var(--ii-font-sm)",
        "ii-base": "var(--ii-font-base)",
        "ii-lg": "var(--ii-font-lg)",
        "ii-xl": "var(--ii-font-xl)",
        "ii-2xl": "var(--ii-font-2xl)",
      },

      // in-it のシャドウ
      boxShadow: {
        "ii-sm": "var(--ii-shadow-sm)",
        "ii-md": "var(--ii-shadow-md)",
        "ii-lg": "var(--ii-shadow-lg)",
      },

      // in-it のトランジション
      transitionDuration: {
        ii: "var(--ii-transition)",
      },
    },
  },
};
```

### 3. vite.config.ts (Vite 使用時)

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

### 4. CSS ファイルの読み込み順

```css
/* app.css */

/* 1. in-it のスタイルが先に読み込まれる（InItStyles コンポーネント経由） */
/* 2. Tailwind の @tailwind ディレクティブ */
@tailwind base;     /* Preflight は無効化済み */
@tailwind components;
@tailwind utilities;

/* 3. アプリ固有の CSS（必要に応じて） */
```

## 使い分け早見表

| 用途 | 推奨 | 例 |
|---|---|---|
| ページヘッダー | `<PageHeader>` | タイトル + 説明 + アクションボタン |
| カードグリッド | `<Grid>` | StatCard の並べ |
| リスト表示 | `<Stack>` + `<ListItem>` | 帳簿一覧 |
| テキスト表示 | `<Text>` | ラベル・説明文 |
| 横並びレイアウト | `<Row>` | アバター + 名前 |
| フォーム | `<Input>`, `<Button>` | ログインフォーム |
| 設定ページ | `<SettingsSection>` | 設定グループ |
| **特殊レイアウト** | **Tailwind** | ダッシュボードウィジェット |
| **完全カスタム UI** | **BEM CSS** | 領収書クロップ UI |

## 使用例

### in-it コンポーネントのみ（推奨）

```tsx
import { PageHeader, Grid, Stack, ListItem, Text, Card } from "@kotsumo/in-it/components";

function DashboardPage() {
  return (
    <>
      <PageHeader title="ダッシュボード" description="概要と最近の活動" />
      <Grid gap={4}>
        <StatCard label="帳簿数" value="12" />
        <StatCard label="政治資金" value="8" />
      </Grid>
      <Card>
        <Stack gap={2}>
          <ListItem title="東京支部" subtitle="政治資金" />
          <ListItem title="選挙2024" subtitle="選挙運動" />
        </Stack>
      </Card>
    </>
  );
}
```

### in-it + Tailwind 併用

```tsx
import { Card, Text } from "@kotsumo/in-it/components";

function CustomWidget() {
  return (
    <Card>
      {/* Tailwind で in-it コンポーネントでは対応できない特殊レイアウト */}
      <div class="flex items-center justify-between p-ii-4 border-b border-outline-variant">
        <Text weight="medium">カスタムウィジェット</Text>
        <span class="text-ii-sm text-on-surface-variant">更新: 5分前</span>
      </div>
      <div class="grid grid-cols-3 gap-ii-4 p-ii-4">
        {/* Tailwind のユーティリティクラスで in-it のトークンを参照 */}
        <div class="rounded-ii-md bg-surface-container p-ii-3">
          <Text size="sm" muted>収入</Text>
          <Text size="xl" weight="bold">¥1,234,567</Text>
        </div>
      </div>
    </Card>
  );
}
```

## ダークモード

Tailwind が in-it の CSS 変数を参照しているため、テーマの切替は自動的に反映されます。

```tsx
// テーマ切替は in-it の ThemeToggle で制御
import { ThemeToggle } from "@kotsumo/in-it/components";

// Tailwind クラスで in-it トークンを使っている部分も自動でダークモード対応
<div class="bg-surface text-on-surface border-outline-variant">
  この要素はダークモードで自動的に色が変わります
</div>
```

`dark:` プレフィックスは**不要**です。in-it の CSS 変数が自動的に切り替わります。

## 注意点

1. **Preflight は必ず無効化する** — in-it は独自の CSS Reset を持っているため、Tailwind の Preflight と衝突します。
2. **`dark:` プレフィックスは使わない** — in-it のテーマシステムが CSS 変数で管理しているため。
3. **コンポーネントが存在する場合はコンポーネントを使う** — Tailwind でレイアウトを組む前に、in-it にそのコンポーネントが無いか確認してください。
4. **アプリ固有の CSS にはプレフィックスを付ける** — `ii-` は in-it 専用。アプリ固有のクラスには `pm-` や `app-` などのプレフィックスを使用してください。
