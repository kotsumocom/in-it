-- ==============================================
-- タグシステム追加スキーマ
-- ==============================================
-- 既存のmentor_schema.sqlを適用済みの前提

-- ==============================================
-- 1. タグマスタテーブル
-- ==============================================
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 分類
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  
  -- タグ情報
  name TEXT NOT NULL,              -- 検索用（小文字、スペースなし）
  display_name TEXT NOT NULL,      -- 表示用
  
  -- 表示制御
  is_featured BOOLEAN DEFAULT false,  -- おすすめタグ
  display_order INTEGER DEFAULT 0,
  
  -- 統計
  usage_count INTEGER DEFAULT 0,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(name)
);

CREATE INDEX idx_tags_category ON public.tags(category_id);
CREATE INDEX idx_tags_featured ON public.tags(is_featured) WHERE is_featured = true;

-- ==============================================
-- 2. カスタムタグ追跡テーブル
-- ==============================================
CREATE TABLE public.custom_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- タグ情報
  original_name TEXT NOT NULL,     -- 入力されたままの文字列
  normalized_name TEXT NOT NULL,   -- 正規化（小文字、トリム）
  
  -- 統計
  usage_count INTEGER DEFAULT 1,
  
  -- 昇格管理
  promoted_to_tag_id UUID REFERENCES public.tags(id) ON DELETE SET NULL,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(normalized_name)
);

CREATE INDEX idx_custom_tags_usage ON public.custom_tags(usage_count DESC);

-- ==============================================
-- 3. メンター ↔ タグ 中間テーブル
-- ==============================================
CREATE TABLE public.mentor_tags (
  mentor_id UUID REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (mentor_id, tag_id)
);

CREATE INDEX idx_mentor_tags_tag ON public.mentor_tags(tag_id);

-- ==============================================
-- 4. メンター ↔ カスタムタグ 中間テーブル
-- ==============================================
CREATE TABLE public.mentor_custom_tags (
  mentor_id UUID REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  custom_tag_id UUID REFERENCES public.custom_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (mentor_id, custom_tag_id)
);

-- ==============================================
-- RLS ポリシー
-- ==============================================

-- タグマスタ: 誰でも閲覧可
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);

-- カスタムタグ: 誰でも閲覧可（検索用）、作成は認証ユーザー
ALTER TABLE public.custom_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Custom tags are viewable by everyone" ON public.custom_tags FOR SELECT USING (true);

-- メンター ↔ タグ: 公開プロフィールのタグは誰でも閲覧可
ALTER TABLE public.mentor_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentor tags are viewable for public profiles" 
  ON public.mentor_tags FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.mentor_profiles 
      WHERE id = mentor_id AND is_public = true
    )
    OR auth.uid() = mentor_id
  );

CREATE POLICY "Users can manage own tags" 
  ON public.mentor_tags FOR ALL 
  USING (auth.uid() = mentor_id);

-- メンター ↔ カスタムタグ: 同様
ALTER TABLE public.mentor_custom_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentor custom tags are viewable for public profiles" 
  ON public.mentor_custom_tags FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.mentor_profiles 
      WHERE id = mentor_id AND is_public = true
    )
    OR auth.uid() = mentor_id
  );

CREATE POLICY "Users can manage own custom tags" 
  ON public.mentor_custom_tags FOR ALL 
  USING (auth.uid() = mentor_id);

-- ==============================================
-- トリガー: updated_at 自動更新
-- ==============================================
CREATE TRIGGER update_custom_tags_updated_at
  BEFORE UPDATE ON public.custom_tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- mentor_profilesからtagsカラムを削除（使わなくなったため）
-- ==============================================
ALTER TABLE public.mentor_profiles DROP COLUMN IF EXISTS tags;
