# TODO: メンタープラットフォーム実装

## 🎯 現在の目標

マルチスペース対応 + 料金プラン + 紹介制度の実装

---

## Phase 1: DB マイグレーション ✅

- [x] `migration_multi_space.sql` のレビュー・確認
- [x] Supabase で SQL 実行
- [x] カテゴリ初期データの確認
- [x] タグ初期データの確認

---

## Phase 2: バックエンド API ✅

### スペース管理

- [x] `POST /api/spaces` - スペース作成
- [x] `GET /api/spaces/:id` - スペース取得
- [x] `PUT /api/spaces/:id` - スペース更新
- [x] `DELETE /api/spaces/:id` - スペース削除
- [x] `GET /api/users/:userId/spaces` - ユーザーのスペース一覧
- [x] `GET /api/public/spaces` - 公開スペース一覧
- [x] `GET /api/public/spaces/:slug` - スペース公開ページ

### タグ管理

- [x] `GET /api/categories` - カテゴリ一覧
- [x] `GET /api/tags` - タグ一覧取得
- [x] `GET /api/tags/featured` - 注目タグ
- [x] `GET /api/tags/search` - タグ検索
- [x] `POST /api/spaces/:id/tags` - スペースにタグ追加
- [x] `GET /api/spaces/:id/tags` - スペースのタグ取得

### サブスクリプション

- [x] `POST /api/subscribe` を `space_id` 対応に更新
- [x] 年間プラン対応（10,000 円/年）
- [x] 紹介コード適用ロジック（追跡のみ、クレジット付与は TODO）

### クーポン管理

- [x] `POST /api/admin/coupons` - クーポン作成（管理者用）
- [x] `GET /api/admin/coupons` - クーポン一覧
- [x] `DELETE /api/admin/coupons/:id` - クーポン削除
- [x] `POST /api/coupons/apply` - クーポン適用

---

## Phase 3: フロントエンド UI ✅

### スペース編集

- [x] スペース作成・編集フォーム
- [ ] サムネイル画像アップロード
- [x] カテゴリ選択（コンボボックス）
- [x] タグ選択（複数選択可）
- [x] 外部リンク管理（website, X, Instagram）
- [ ] Markdown 説明文エディタ

### スペース公開ページ

- [x] `/s/:slug` - スペース公開ページ
- [x] 「このスペースを契約する」ボタン（UI のみ）
- [x] 月額/年額プラン選択（UI のみ）

### マイページ

- [x] 自分のスペース一覧
- [ ] 契約中のスペース一覧
- [x] 紹介コード表示・共有

### 管理者機能

- [x] クーポン管理画面

---

## Phase 4: Stripe 連携 ✅

- [x] 年間プラン用 Price 作成（setup-stripe.ts スクリプト）
- [x] 紹介制度用クーポン作成（setup-stripe.ts スクリプト）
- [x] 紹介コードでクーポン自動適用
- [ ] Invoice Credit（紹介者報酬）ロジック
- [x] Webhook 処理の更新（space_id 対応済み）

---

## 技術仕様

### 参照ドキュメント

- [マルチスペース仕様](./multi_space_spec.md)
- [マイグレーション SQL](./migration_multi_space.sql)
- [MVP 仕様](./mvp-spec.md)

### 技術スタック

- **フロントエンド**: Fresh (Deno)
- **バックエンド**: Hono (Deno)
- **データベース**: Supabase (PostgreSQL)
- **決済**: Stripe
- **ホスティング**: Deno Deploy

---

## 完了済み

- [x] マルチスペース仕様設計
- [x] マイグレーション SQL 作成
- [x] タグシステム設計・SQL 追加
