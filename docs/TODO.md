# TODO: メンタープラットフォーム実装

## 🎯 現在の目標

マルチスペース対応 + 料金プラン + 紹介制度の実装

---

## Phase 1: DB マイグレーション ✅

- [x] `migration_multi_space.sql` のレビュー・確認
- [x] Supabase で SQL 実行
- [x] カテゴリ初期データの確認
- [x] タグ初期データの確認
- [x] 通知テーブル追加（`migration_notifications.sql`）
- [x] カスタムタグテーブル追加
- [x] Storage バケット作成（avatars, spaces）

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
- [x] `POST /api/spaces/upload-image` - スペース画像アップロード

### タグ管理

- [x] `GET /api/categories` - カテゴリ一覧
- [x] `GET /api/tags` - タグ一覧取得
- [x] `GET /api/tags/featured` - 注目タグ
- [x] `GET /api/tags/search` - タグ検索
- [x] `POST /api/spaces/:id/tags` - スペースにタグ追加（カスタムタグ対応）
- [x] `GET /api/spaces/:id/tags` - スペースのタグ取得
- [x] `GET /api/admin/custom-tags` - カスタムタグランキング（管理者用）
- [x] `POST /api/admin/custom-tags/:id/promote` - カスタムタグ昇格（管理者用）

### プロフィール管理

- [x] `GET /api/profile` - プロフィール取得
- [x] `PUT /api/profile` - プロフィール更新
- [x] `POST /api/profile/avatar` - アバターアップロード
- [x] `DELETE /api/profile/avatar` - アバター削除

### 通知機能

- [x] `GET /api/notifications` - 通知一覧取得
- [x] `PUT /api/notifications/:id/read` - 通知既読
- [x] `PUT /api/notifications/read-all` - 全通知既読

### サブスクリプション

- [x] `POST /api/subscribe` を `space_id` 対応に更新
- [x] 年間プラン対応（10,000 円/年）
- [x] 紹介コード適用ロジック（追跡のみ）
- [ ] Invoice Credit（紹介者報酬）ロジック

### クーポン管理

- [x] `POST /api/admin/coupons` - クーポン作成（管理者用）
- [x] `GET /api/admin/coupons` - クーポン一覧
- [x] `DELETE /api/admin/coupons/:id` - クーポン削除
- [x] `POST /api/coupons/apply` - クーポン適用

---

## Phase 3: フロントエンド UI ✅

### スペース編集

- [x] スペース作成・編集フォーム
- [x] サムネイル画像アップロード（削除機能付き）
- [x] カテゴリ選択（コンボボックス）
- [x] タグ選択（複数選択可 + 自由入力対応）
- [x] 外部リンク管理（website, X, Instagram）
- [x] Editor.js ブロックエディタ（見出し、リスト、画像、引用）

### プロフィール編集

- [x] 表示名・タグライン・自己紹介の編集
- [x] プロフィール画像アップロード（Cropper.js 円形切り抜き）
- [x] プロフィール画像削除

### スペース公開ページ

- [x] `/s/:slug` - スペース公開ページ
- [x] 「このスペースを契約する」ボタン
- [x] 月額/年額プラン選択

### マイページ

- [x] 自分のスペース一覧
- [ ] 契約中のスペース一覧
- [x] 紹介コード表示・共有
- [x] ダッシュボードにアバター表示

### 管理者機能

- [x] クーポン管理画面
- [x] カスタムタグ管理（ランキング・昇格）

---

## Phase 4: Stripe 連携 ✅

- [x] 年間プラン用 Price 作成（setup-stripe.ts スクリプト）
- [x] 紹介制度用クーポン作成（setup-stripe.ts スクリプト）
- [x] 紹介コードでクーポン自動適用
- [ ] Invoice Credit（紹介者報酬）ロジック
- [x] Webhook 処理の更新（space_id 対応済み）

---

## 残りタスク

- [ ] **契約中のスペース一覧** - ダッシュボードに表示
- [ ] **Invoice Credit（紹介者報酬）** - 紹介者への報酬ロジック

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
- **Storage**: Supabase Storage (avatars, spaces)
- **エディタ**: Editor.js
- **画像切り抜き**: Cropper.js
- **ホスティング**: Deno Deploy
