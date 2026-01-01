# マルチスペース対応 仕様設計 v4

## 料金プラン

| 期間 | 料金                            |
| ---- | ------------------------------- |
| 月額 | 1,000 円/スペース               |
| 年額 | 10,000 円/スペース (2 ヶ月お得) |

---

## クーポン制度

### 1. 紹介クーポン（メンター間）

| 対象     | 特典               |
| -------- | ------------------ |
| 被招待者 | 初月 100%OFF       |
| 招待者   | 1,000 円クレジット |

### 2. 運営クーポン

| 種類     | 用途             |
| -------- | ---------------- |
| 1 年無料 | 知人への特別招待 |
| 任意期間 | キャンペーン等   |

→ **運営管理画面で発行・管理**

---

## データモデル

```sql
-- ユーザー基本情報
CREATE TABLE public.mentor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- スペース
CREATE TABLE public.mentor_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  title TEXT NOT NULL,
  thumbnail_url TEXT,             -- 1:1
  description TEXT,               -- 自由テキスト（MD対応）

  category_id UUID REFERENCES categories(id),
  tags TEXT[],

  website_url TEXT,
  x_url TEXT,
  instagram_url TEXT,

  external_links JSONB DEFAULT '[]',

  is_public BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- 運営クーポン管理
CREATE TABLE public.admin_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  stripe_coupon_id TEXT,
  type TEXT NOT NULL,             -- 'year_free', 'custom'
  duration_months INTEGER,
  max_uses INTEGER DEFAULT 1,
  use_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## UI 設計

### スペース編集

```
┌──────────────────────────┐
│ [サムネイル 📷] 1:1     │
│                          │
│ タイトル: [__________]   │
│                          │
│ カテゴリ: [🔍 コンボ ▼]  │
│ タグ: [🔍 複数選択  ]    │
│                          │
│ 説明:                    │
│ [編集] [プレビュー]      │
│ ┌──────────────────┐    │
│ │ MDテキスト入力    │    │
│ └──────────────────┘    │
│                          │
│ Website: [__________]    │
│ X: [__________]          │
│ Instagram: [__________]  │
│                          │
│ 外部リンク:              │
│ [ラベル] [URL] [×]       │
│ [+ 追加]                 │
│                          │
│ URL: in-it.ooo/s/[___]   │
├──────────────────────────┤
│ [🔓 スペースを契約する]  │
│ または                    │
│ □ 公開する               │
└──────────────────────────┘
```

### 運営管理画面（新規）

```
/admin/coupons

┌──────────────────────────┐
│ クーポン管理              │
├──────────────────────────┤
│ [+ 新規発行]             │
│                          │
│ | コード | 種類 | 使用 |  │
│ | INVITE2024 | 1年無料 | 0/1 |
│ | FRIEND001  | 1年無料 | 1/1 |
└──────────────────────────┘
```

---

## 実装ステップ

1. スキーマ変更
2. スペース API + UI
3. MD プレビュー実装
4. 運営管理画面
5. Stripe 連携（年額 + クーポン）
