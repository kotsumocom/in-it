# マルチスペ�Eス対忁E仕様設訁Ev4

## 料��プラン

| 期間 | 料��                            |
| ---- | ------------------------------- |
| 月顁E| 1,000 冁Eスペ�Eス               |
| 年顁E| 10,000 冁Eスペ�Eス (2 ヶ月お征E |

---

## クーポン制度

### 1. 紹介クーポン�E�メンター間！E

| 対象     | 特典               |
| -------- | ------------------ |
| 被招征E��E| 初月 100%OFF       |
| 招征E��E  | 1,000 冁E��レジチE�� |

### 2. 運営クーポン

| 種顁E    | 用送E            |
| -------- | ---------------- |
| 1 年無斁E| 知人への特別招征E|
| 任意期閁E| キャンペ�Eン筁E  |

ↁE**運営管琁E��面で発行�E管琁E*

---

## チE�EタモチE��

```sql
-- ユーザー基本惁E��
CREATE TABLE public.mentor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- スペ�Eス
CREATE TABLE public.mentor_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  title TEXT NOT NULL,
  thumbnail_url TEXT,             -- 1:1
  description TEXT,               -- 自由チE��スト！ED対応！E

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

-- 運営クーポン管琁E
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

## UI 設訁E

### スペ�Eス編雁E

```
┌──────────────────────────━E
━E[サムネイル 📷] 1:1     ━E
━E                         ━E
━Eタイトル: [__________]   ━E
━E                         ━E
━EカチE��リ: [🔍 コンチE▼]  ━E
━Eタグ: [🔍 褁E��選抁E ]    ━E
━E                         ━E
━E説昁E                    ━E
━E[編雁E [プレビュー]      ━E
━E┌──────────────────━E   ━E
━E━EMDチE��スト�E劁E   ━E   ━E
━E└──────────────────━E   ━E
━E                         ━E
━EWebsite: [__________]    ━E
━EX: [__________]          ━E
━EInstagram: [__________]  ━E
━E                         ━E
━E外部リンク:              ━E
━E[ラベル] [URL] [×]       ━E
━E[+ 追加]                 ━E
━E                         ━E
━EURL: in-it.dev/s/[___]   ━E
├──────────────────────────┤
━E[🔓 スペ�Eスを契紁E��る]  ━E
━Eまた�E                    ━E
━E□ 公開すめE              ━E
└──────────────────────────━E
```

### 運営管琁E��面�E�新規！E

```
/admin/coupons

┌──────────────────────────━E
━Eクーポン管琁E             ━E
├──────────────────────────┤
━E[+ 新規発行]             ━E
━E                         ━E
━E| コーチE| 種顁E| 使用 |  ━E
━E| INVITE2024 | 1年無斁E| 0/1 |
━E| FRIEND001  | 1年無斁E| 1/1 |
└──────────────────────────━E
```

---

## 実裁E��チE��チE

1. スキーマ変更
2. スペ�Eス API + UI
3. MD プレビュー実裁E
4. 運営管琁E��面
5. Stripe 連携�E�年顁E+ クーポン�E�E
