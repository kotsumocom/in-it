# レビュー機能 - 投稿者特定・開示請求対応設計

## 概要

悪質なレビュー投稿に対する法的対応（発信者情報開示請求）を可能にするための技術設計。

---

## 法的背景

### プロバイダ責任制限法（プロ責法）

- 権利侵害を受けた者は、サービス提供者に対し発信者情報の開示を請求できる
- 開示対象：氏名、住所、メールアドレス、IP アドレス、タイムスタンプ等
- **ログ保存義務はないが、保存していないと開示できない**

### 対応が必要なケース

- 名誉毀損（事実でない誹謗中傷）
- 業務妨害（虚偽の悪評による営業妨害）
- 侮辱（人格攻撃）

---

## 保存すべきデータ

### レビュー投稿時に記録

| データ項目       | 説明                                 | 保存期間             |
| ---------------- | ------------------------------------ | -------------------- |
| `user_id`        | 投稿者のユーザー ID（Supabase Auth） | 永続                 |
| `email`          | 投稿時点のメールアドレス             | 3 年                 |
| `ip_address`     | 投稿時の IP アドレス                 | 1 年（法的推奨期間） |
| `user_agent`     | ブラウザ・デバイス情報               | 1 年                 |
| `created_at`     | 投稿日時（UTC）                      | 永続                 |
| `review_content` | レビュー本文（削除後も保存）         | 3 年                 |

### 補足データ

| データ項目           | 説明                                      |
| -------------------- | ----------------------------------------- |
| `account_created_at` | アカウント作成日時                        |
| `registration_ip`    | アカウント登録時の IP                     |
| `phone_number`       | 電話番号（任意、将来的に SMS 認証導入時） |

---

## DB 設計

### `reviews` テーブル

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES profiles(id),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,

  -- 開示請求用メタデータ
  reviewer_email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,

  -- ステータス
  is_visible BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: レビューは誰でも閲覧可、作成は認証ユーザーのみ
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 閲覧ポリシー
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_visible = true AND is_deleted = false);

-- 作成ポリシー
CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);
```

### `review_audit_logs` テーブル（非公開・管理者専用）

```sql
CREATE TABLE review_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id),
  action TEXT NOT NULL, -- 'created', 'edited', 'deleted', 'reported'
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: 管理者のみアクセス可
ALTER TABLE review_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
  ON review_audit_logs FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 実装ポイント

### 1. IP アドレス取得

```typescript
// Hono (API側)
app.post("/api/reviews", async (c) => {
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0] ||
    c.req.header("x-real-ip") ||
    "unknown";

  const userAgent = c.req.header("user-agent") || "";

  // レビュー作成時にIP・UAを保存
});
```

### 2. Deno Deploy での注意

- `x-forwarded-for` ヘッダーからクライアント IP を取得
- プロキシ経由の場合、最初の IP がクライアント IP

### 3. メールアドレスのスナップショット

- レビュー投稿時点のメールアドレスを `reviewer_email` に保存
- ユーザーがメール変更しても追跡可能

---

## プライバシーポリシーへの記載

以下の内容を明記する必要あり：

```
### 投稿情報の取り扱い

当サービスでは、レビュー等の投稿時に以下の情報を記録します：

- 投稿日時
- IPアドレス
- 利用端末情報（ブラウザ、OS等）
- 登録メールアドレス

これらの情報は、以下の目的で利用します：

1. 不正利用・規約違反行為の調査
2. 法令に基づく開示請求への対応
3. サービス品質の向上

IPアドレス等の通信記録は、投稿日から1年間保存した後、削除します。
```

---

## 開示請求対応フロー

```
1. 被害者（メンター）が弁護士に相談
      ↓
2. 弁護士が投稿者情報の開示を請求
      ↓
3. 運営がプロ責法に基づき開示可否を判断
      ↓
4. 開示可能な場合、保存データを提供
   - メールアドレス
   - IPアドレス
   - タイムスタンプ
      ↓
5. 弁護士がISPに対し契約者情報開示請求
```

---

## セキュリティ考慮

### 開示請求用データの保護

- `ip_address`, `reviewer_email` は管理者のみ閲覧可
- 一般ユーザーには表示しない
- RLS で厳格にアクセス制御

### 不正アクセス対策

- 管理画面へのアクセスログ記録
- 2FA 導入（管理者アカウント）

---

## MVP スコープ

### 含める

- レビューテーブルに IP・メール・UA 保存
- プライバシーポリシーへの記載

### 後回し

- 管理画面での開示請求対応 UI
- 自動削除（1 年後の IP 削除ジョブ）

---

## 利用規約への記載（レビュー二次利用）

投稿者がレビュー投稿時に同意する内容：

```
### レビュー投稿に関する規約

1. 投稿されたレビューの権利
   - 投稿されたレビュー内容の著作権は投稿者に帰属します
   - ただし、投稿者は以下の利用を許諾するものとします

2. 講師（被レビュー者）による利用
   - 講師は、自身に対するレビューを以下の目的で使用できます：
     - 自身のWebサイト、SNS、ポートフォリオへの掲載
     - 宣伝・広告目的での引用
     - 名刺、資料等への掲載
   - 使用にあたり、投稿者への個別許諾は不要です
   - 講師は投稿者の氏名・アイコン等を伏せて使用することも、
     表示したまま使用することもできます

3. 運営による利用
   - 運営はサービス紹介・プロモーション目的でレビューを使用できます
   - 統計データとしての集計・分析に使用することがあります

4. 投稿者の責任
   - 投稿内容が第三者の権利を侵害しないこと
   - 虚偽の内容を投稿しないこと
```

### UI 上の同意取得

レビュー投稿フォームに以下のチェックボックスを設置：

```
☐ 投稿したレビューは、講師が自身のサイト・SNS等で
   紹介目的に使用する場合があることに同意します
```

※チェック必須、未チェックでは投稿不可

---

## TODO

- [ ] プライバシーポリシー文言の法務確認
- [ ] **利用規約の法務確認（二次利用条項）**
- [ ] レビュー機能実装時に IP 取得ロジック組み込み
- [ ] 管理者ロールの定義
