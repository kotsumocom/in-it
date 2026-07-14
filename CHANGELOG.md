# Changelog

すべての重要な変更を記録します。

## [0.7.0] — 2026-07-14

### ⚠️ Breaking Changes

- **`injectCSS()` を廃止**: コンポーネントはランタイムで CSS を自動注入しなくなりました。アプリ起動時に `injectStyles()` を呼ぶか、SSR では `<StyleSheet />` を使用してください。
- **`styles.ts` → `styles.tsx` にリネーム**: `import` パスが `@kotsumo/in-it/styles` のままであれば影響ありません（`deno.json` のエクスポートで吸収）。

### 追加

- `base-css.ts`: Variables, Reset, Icon, Animations の基盤 CSS 定数
- `chart-css.ts`: チャートコンポーネント共有 CSS（コンテナ、ツールチップ、アニメーション）
- `Tooltip` コンポーネントに独自 CSS を追加（Popover 依存解消）

### 変更

- **CSS アーキテクチャ統一**: 全コンポーネントの CSS を `.tsx` ファイル内に文字列定数としてコロケーション化
  - UI コンポーネント 19 ファイル
  - Interactive コンポーネント 16 ファイル
  - Chart コンポーネント 4 ファイル
  - Layout コンポーネント 2 ファイル
  - Admin コンポーネント 1 ファイル
- `styles.tsx`: 自動生成された 2,553 行の巨大文字列 → 186 行の import 結合方式に変更

### 削除

- `css.ts` (48KB): 旧 CSS 集約ファイル
- `inject.ts` (1KB): `injectCSS` ランタイム注入ヘルパー
- `src/css/` ディレクトリ: 全 `.css` コンポーネントファイル（JSR 配布不可のため `.tsx` 内に移行済み）

---

## [0.6.0] — 2026-07-14

### 追加

- PricingCard の CTA デフォルト値を `t("getStarted")` で多言語化
- `in-it.config.ts` でデフォルトテーマ（light/dark/system）の初期値設定をサポート
- `setConfig` 経由でテーマ即時適用
- `setLocale` で `lang` 属性自動セット
- CJK タイポグラフィスケールオーバーライド（`:root:lang(ja)`）

### 変更

- フィーチャーカードのホバーエフェクトからリフト・primaryカラー変化を削除（非インタラクティブ要素のUX改善）
- 機能カード説明文の文字サイズを `--ii-font-sm` → `--ii-font-base` に引き上げ
- UI extras.tsx に定義されていた 7 個の UI コンポーネントを個別ファイルに分割

### 修正

- ボタンのデフォルトサイズ未定義（PricingCard 等で高さが最小になる）
- フォント指定順序修正（`Inter, Noto Sans JP` の順に）
- body line-height を CJK 向けに 1.7 に設定

---

## [0.5.0] — 2026-07-12

初回 JSR 公開バージョン。
