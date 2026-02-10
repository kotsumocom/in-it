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
- [x] Invoice Credit（紹介者報酬）ロジック（Webhook内で実装済み）

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

- [x] 表示名の編集
- [x] プロフィール画像アップロード（Cropper.js 円形切り抜き）
- [x] プロフィール画像削除

### スペース公開ページ

- [x] `/s/:slug` - スペース公開ページ
- [x] 「このスペースを契約する」ボタン
- [x] 月額/年額プラン選択

### マイページ

- [x] 自分のスペース一覧
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
- [x] Invoice Credit（紹介者報酬）ロジック（Webhook内で実装済み）
- [x] Webhook 処理の更新（space_id 対応済み）

## Phase 5: マーケティング・SEO ✅

### SEO / OGP

- [x] `_app.tsx` にデフォルトOGP / Twitterカードメタタグ追加
- [x] スペース詳細ページ（`/s/[slug]`）に個別OGPメタタグ
- [x] ページ別SEOメタタグ（title / description）
- [x] JSON-LD構造化データ（スペース詳細ページ）
- [x] `sitemap.xml` 動的生成ルート
- [x] `robots.txt` ルート
- [x] OGP用SVG画像（`/ogp.svg`）

### SNS共有

- [x] SNS共有ボタン Island（X / LINE / リンクコピー）
- [x] メンタープロフィールページにもSNS共有ボタン追加
- [x] トップページフッターに公式SNSリンク追加

### LP

- [x] メンター向けLP（`/lp`）にOGPメタタグ追加
- [x] メンター向けLP（`/lp`）に「スペースとは？」セクション追加
- [x] メンティー向けLP（`/for-learners`）新規作成
- [x] FAQページ（`/faq`）作成（SEOメタタグ + JSON-LD構造化データ付き）

### SNS運用（非コード）

- [x] Xアカウント開設・運用開始（https://x.com/in_it_ooo）
- [x] noteでの発信（https://note.com/in_it_ooo）
- [ ] Google Search Console にsitemap.xml登録

---

## 残りタスク

### マーケティング（非コード）

- [ ] **Google Search Console設定** - sitemap.xml登録

### 完了済み

- [x] **Invoice Credit（紹介者報酬）** - Webhook内で実装済み（handleCheckoutComplete）
- [x] **FAQページ作成** - よくある質問ページ（SEOメタタグ + JSON-LD付き）
- [x] **メンタープロフィールページにSNS共有ボタン追加**
- [x] **Xアカウント開設** - https://x.com/in_it_ooo
- [x] **noteアカウント開設** - https://note.com/in_it_ooo
- [x] **プロフィールからtagline/bio削除** - スペースへの集約に伴い、プロフィール編集ページから削除
- [x] **メンターページ改造** - 旧メンター公開ページをスペース一覧ページに改造
- [x] **メンター一覧ページ修正** - tagline等の旧カラム参照を削除

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
