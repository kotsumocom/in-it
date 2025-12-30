# TODO: メンタープラットフォーム MVP

## 🎯 目標

手数料ゼロ・月額 1,000 円（税別）のメンター/講師マーケットプレイス MVP

---

## Phase 1: 基盤構築

### 1.1 DB 設計

- [ ] 講師プロフィールテーブル設計
  - 名前、自己紹介、アイコン画像 URL
  - 外部リンク（SNS、予約ページ等）
  - カテゴリ/タグ
  - 公開ステータス
- [ ] サブスクリプション管理テーブル
  - Stripe Customer ID
  - Stripe Subscription ID
  - ステータス（active, canceled, past_due 等）
- [ ] クーポン/招待管理テーブル
  - 招待コード
  - 招待者（紹介したメンター）
  - 被招待者
  - 使用日時

### 1.2 認証

- [ ] Supabase Auth セットアップ
- [ ] サインアップ/ログイン画面
- [ ] メール確認フロー

### 1.3 Stripe 連携

- [ ] Stripe 商品・価格設定（月額 1,000 円税別）
- [ ] Checkout Session 作成 API
- [ ] Webhook 受信（subscription.created, updated, deleted 等）
- [ ] Customer Portal 設定

---

## Phase 2: コア機能

### 2.1 講師プロフィール

- [ ] プロフィール登録フォーム
- [ ] プロフィール編集機能
- [ ] 公開プロフィールページ（簡易 LP）
- [ ] 外部リンク表示

### 2.2 講師一覧・検索

- [ ] 講師一覧ページ
- [ ] カテゴリフィルター
- [ ] 簡易キーワード検索

### 2.3 クーポン機能

- [ ] 運営者クーポン発行（Stripe Coupon）
- [ ] Checkout 時のクーポン適用
- [ ] メンター招待コード生成
- [ ] 招待コードによる 1 ヶ月無料適用
- [ ] 招待履歴表示

---

## Phase 3: 改善・拡張（MVP 後）

### 3.1 信頼構築

- [ ] レビュー/評価機能
  - [ ] 投稿者 IP・メールアドレスのログ保存（開示請求対応）
  - [ ] プライバシーポリシーへの明記
- [ ] 本人確認バッジ
- [ ] 学歴/資格証明

### 3.2 収益拡大

- [ ] 有料オプション（上位表示）
- [ ] 認証バッジ課金
- [ ] 広告枠

### 3.3 コミュニティ

- [ ] メッセージ機能（任意）
- [ ] 運営ブログ/お知らせ

---

## 技術タスク

### インフラ

- [ ] Stripe API キー設定（.env）
- [ ] Webhook 署名検証設定
- [ ] 本番環境デプロイ設定

### フロントエンド

- [ ] 決済フロー画面
- [ ] マイページ（サブスク状態表示）
- [ ] エラー/成功メッセージ表示

### バックエンド

- [ ] Stripe 関連 API（Hono）
- [ ] 講師 CRUD API
- [ ] クーポン関連 API

---

## UI/デザイン

### 方針

- Material Design 3 ベース
- シングルカラムレイアウト
- 角ばったエッジ（Firebase/GitLab 風）
- 寒色系カラー（Blue/Teal）

### ブランディング

- サービス名: **in-it**（イニット）
- ロゴ: カタカナ「イニット」またはシンボル
- ターゲット: 日本語圏

### TODO

- [ ] ロゴデザイン
- [ ] カラーパレット確定
- [ ] フォント選定
- [ ] ボタン/カード角丸サイズ
- [ ] シャドウ・アニメーション詳細

---

## 参考資料

- [メンタープラットフォーム新モデル検証](./docs/メンタープラットフォーム新モデル検証.md)
- Stripe Billing: https://stripe.com/docs/billing
- Stripe Coupons: https://stripe.com/docs/billing/subscriptions/coupons
- Stripe Promotion Codes: https://stripe.com/docs/billing/subscriptions/discounts/codes
