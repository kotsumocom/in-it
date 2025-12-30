# タグ管理システム設計

## 設計方針

**メンティー（検索者）の UX 優先**

- タグはできるだけマスタで取り揃える
- 自由入力は許可するが、検索はマスタ優先
- 人気のカスタムタグは運営が手動でマスタに昇格

---

## DB 設計

### 1. タグマスタテーブル

```sql
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 分類
  category_id UUID REFERENCES public.categories(id),

  -- タグ情報
  name TEXT NOT NULL,              -- 'python'（検索用、小文字）
  display_name TEXT NOT NULL,      -- 'Python'（表示用）

  -- 表示制御
  is_featured BOOLEAN DEFAULT false,  -- おすすめタグ
  display_order INTEGER DEFAULT 0,

  -- メタ
  usage_count INTEGER DEFAULT 0,   -- 使用回数（キャッシュ）
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(category_id, name)
);
```

### 2. カスタムタグ追跡テーブル

```sql
CREATE TABLE public.custom_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- タグ情報
  name TEXT NOT NULL,              -- 自由入力されたタグ
  normalized_name TEXT NOT NULL,   -- 正規化（小文字、トリム）

  -- 統計
  usage_count INTEGER DEFAULT 1,

  -- 昇格管理
  promoted_to_tag_id UUID REFERENCES public.tags(id),  -- マスタに昇格済みならID

  -- メタ
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(normalized_name)
);
```

### 3. メンター ↔ タグ 中間テーブル

```sql
CREATE TABLE public.mentor_tags (
  mentor_id UUID REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (mentor_id, tag_id)
);

-- カスタムタグ（マスタにないもの）
CREATE TABLE public.mentor_custom_tags (
  mentor_id UUID REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  custom_tag_id UUID REFERENCES public.custom_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (mentor_id, custom_tag_id)
);
```

---

## UI フロー

### メンター登録時

```
タグ入力（コンボボックス）
┌─────────────────────────────────────┐
│ Python                            ▼│
├─────────────────────────────────────┤
│ ★ Python           ← マスタ（おすすめ）
│ ★ JavaScript
│ ★ TypeScript
│ ─────────────────────
│   PHP              ← マスタ（通常）
│   Ruby
│ ─────────────────────
│ + 「FastAPI」を新規追加  ← 自由入力
└─────────────────────────────────────┘
```

1. 入力中にマスタタグをサジェスト
2. マスタにない場合は「新規追加」として登録
3. 新規追加 → `custom_tags` に記録

### メンター検索時

```
タグで絞り込み
┌─────────────────────────────────────┐
│ [Python] [JavaScript] [React] [+]  │
└─────────────────────────────────────┘

※ マスタタグのみ表示（検索しやすさ優先）
※ カスタムタグは検索対象に含めるが、フィルターUIには表示しない
```

---

## 運営管理画面

### カスタムタグ一覧

```
┌─────────────────────────────────────────────────────┐
│ カスタムタグ管理                                    │
├─────────────────────────────────────────────────────┤
│ タグ名        使用数    ステータス    アクション   │
├─────────────────────────────────────────────────────┤
│ FastAPI         15      未登録      [マスタに追加] │
│ Next.js         12      未登録      [マスタに追加] │
│ Supabase         8      未登録      [マスタに追加] │
│ ぱいそん         3      未登録      [削除][マージ] │
│ Python           -      マスタ済み        -        │
└─────────────────────────────────────────────────────┘
```

**機能:**

- 使用数順でソート
- 「マスタに追加」→ マスタタグに昇格
- 「マージ」→ 既存マスタタグに統合（表記揺れ対応）
- 「削除」→ 不適切なタグを削除

---

## 検索ロジック

```sql
-- メンター検索（タグ指定時）
SELECT mp.*
FROM mentor_profiles mp
WHERE mp.is_public = true
  AND (
    -- マスタタグで検索
    EXISTS (
      SELECT 1 FROM mentor_tags mt
      WHERE mt.mentor_id = mp.id
        AND mt.tag_id = ANY($tag_ids)
    )
    OR
    -- カスタムタグでも検索（フォールバック）
    EXISTS (
      SELECT 1 FROM mentor_custom_tags mct
      JOIN custom_tags ct ON ct.id = mct.custom_tag_id
      WHERE mct.mentor_id = mp.id
        AND ct.normalized_name = ANY($search_terms)
    )
  );
```

---

## MVP スコープ

### 含める

- タグマスタテーブル
- メンター ↔ タグ 中間テーブル
- コンボボックス UI（マスタ優先表示）
- 自由入力の記録

### 後回し

- 運営管理画面のフル機能
- カスタムタグの自動昇格

---

## TODO

- [ ] スキーマ更新 SQL の作成
- [ ] タグマスタの初期データ投入
- [ ] カテゴリリストの確定
