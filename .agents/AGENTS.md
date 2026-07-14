# in-it Project Rules

## Language
- All source code comments MUST be written in English.
- JSDoc comments MUST be in English.
- Variable names, function names, and class names MUST be in English.
- Git commit messages MUST be in Japanese (per global rule).
- Documentation files (.md) intended for Japanese users may be in Japanese.

## Code Style
- Use the `ii-` prefix for all CSS class names (BEM convention: `ii-block__element--modifier`).
- All components use hono/jsx for JSX rendering.
- Export all public components and types from `src/components/mod.ts`.
- Export all public color utilities from `src/color/`.
- Export all public docs utilities from `src/docs/`.
- 一括修正や一括置換を行う自動スクリプトは使用せず、各コンポーネントおよびファイルを1つずつ確認しながら丁寧に修正・検証すること。

## Architecture
- Zero external dependencies for core functionality (ARIA, color, markdown, router).
- Components must be WAI-ARIA compliant where applicable.
- Support both Deno and Bun runtimes.
- CSS variables use `--ii-` prefix for design tokens.

## JSR Publishing
- Version is managed in `packages/in-it/deno.json`.
- Tag format: `v{major}.{minor}.{patch}` (e.g., `v0.1.0`).
- Publishing is automated via GitHub Actions on tag push.
