-- ==============================================
-- マルチスペース対応 マイグレーション
-- ==============================================

-- ==============================================
-- 1. 依存するRLSポリシーを先に削除
-- ==============================================
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.mentor_profiles;
DROP POLICY IF EXISTS "Mentor tags are viewable for public profiles" ON public.mentor_tags;
DROP POLICY IF EXISTS "Mentor custom tags are viewable for public profiles" ON public.mentor_custom_tags;

-- 旧テーブルの削除（mentor_tags, mentor_custom_tagsはspace_tagsに置き換え）
DROP TABLE IF EXISTS public.mentor_custom_tags;
DROP TABLE IF EXISTS public.mentor_tags;

-- ==============================================
-- 2. mentor_profiles テーブルの変更
-- ==============================================
ALTER TABLE public.mentor_profiles
  DROP COLUMN IF EXISTS tagline,
  DROP COLUMN IF EXISTS bio,
  DROP COLUMN IF EXISTS category_id,
  DROP COLUMN IF EXISTS tags,
  DROP COLUMN IF EXISTS external_links,
  DROP COLUMN IF EXISTS is_public,
  DROP COLUMN IF EXISTS slug,
  DROP COLUMN IF EXISTS verification_status;

-- ==============================================
-- 3. カテゴリ初期データ（なければ作成）
-- ==============================================
INSERT INTO public.categories (name, display_name, display_order) VALUES
  ('programming', 'IT・テクノロジー', 1),
  ('language', '語学', 2),
  ('business', 'ビジネス・キャリア', 3),
  ('creative', 'クリエイティブ', 4),
  ('music', '音楽・アート', 5),
  ('learning', '学習・受験', 6),
  ('money', 'お金・資産', 7),
  ('lifestyle', 'ライフスタイル', 8),
  ('other', 'その他', 99)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  display_order = EXCLUDED.display_order;

-- ==============================================
-- 4. タグマスタテーブル（なければ作成）
-- ==============================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================
-- 5. 初期タグデータ
-- ==============================================
-- プログラミング
INSERT INTO public.tags (name, display_name, category_id, is_featured, display_order) VALUES
  ('python', 'Python', (SELECT id FROM categories WHERE name = 'programming'), true, 1),
  ('javascript', 'JavaScript', (SELECT id FROM categories WHERE name = 'programming'), true, 2),
  ('typescript', 'TypeScript', (SELECT id FROM categories WHERE name = 'programming'), true, 3),
  ('react', 'React', (SELECT id FROM categories WHERE name = 'programming'), true, 4),
  ('vue', 'Vue.js', (SELECT id FROM categories WHERE name = 'programming'), false, 5),
  ('nextjs', 'Next.js', (SELECT id FROM categories WHERE name = 'programming'), false, 6),
  ('nodejs', 'Node.js', (SELECT id FROM categories WHERE name = 'programming'), false, 7),
  ('go', 'Go', (SELECT id FROM categories WHERE name = 'programming'), false, 8),
  ('rust', 'Rust', (SELECT id FROM categories WHERE name = 'programming'), false, 9),
  ('java', 'Java', (SELECT id FROM categories WHERE name = 'programming'), false, 10),
  ('swift', 'Swift', (SELECT id FROM categories WHERE name = 'programming'), false, 11),
  ('kotlin', 'Kotlin', (SELECT id FROM categories WHERE name = 'programming'), false, 12),
  ('flutter', 'Flutter', (SELECT id FROM categories WHERE name = 'programming'), false, 13),
  ('aws', 'AWS', (SELECT id FROM categories WHERE name = 'programming'), false, 14),
  ('docker', 'Docker', (SELECT id FROM categories WHERE name = 'programming'), false, 15)
ON CONFLICT (name) DO NOTHING;

-- 語学
INSERT INTO public.tags (name, display_name, category_id, is_featured, display_order) VALUES
  ('english', '英語', (SELECT id FROM categories WHERE name = 'language'), true, 1),
  ('chinese', '中国語', (SELECT id FROM categories WHERE name = 'language'), true, 2),
  ('korean', '韓国語', (SELECT id FROM categories WHERE name = 'language'), true, 3),
  ('spanish', 'スペイン語', (SELECT id FROM categories WHERE name = 'language'), false, 4),
  ('french', 'フランス語', (SELECT id FROM categories WHERE name = 'language'), false, 5),
  ('german', 'ドイツ語', (SELECT id FROM categories WHERE name = 'language'), false, 6),
  ('toeic', 'TOEIC', (SELECT id FROM categories WHERE name = 'language'), false, 7),
  ('ielts', 'IELTS', (SELECT id FROM categories WHERE name = 'language'), false, 8)
ON CONFLICT (name) DO NOTHING;

-- ビジネス
INSERT INTO public.tags (name, display_name, category_id, is_featured, display_order) VALUES
  ('marketing', 'マーケティング', (SELECT id FROM categories WHERE name = 'business'), true, 1),
  ('sales', '営業', (SELECT id FROM categories WHERE name = 'business'), false, 2),
  ('management', 'マネジメント', (SELECT id FROM categories WHERE name = 'business'), false, 3),
  ('startup', 'スタートアップ', (SELECT id FROM categories WHERE name = 'business'), false, 4),
  ('career', 'キャリア相談', (SELECT id FROM categories WHERE name = 'business'), true, 5)
ON CONFLICT (name) DO NOTHING;

-- クリエイティブ
INSERT INTO public.tags (name, display_name, category_id, is_featured, display_order) VALUES
  ('design', 'デザイン', (SELECT id FROM categories WHERE name = 'creative'), true, 1),
  ('figma', 'Figma', (SELECT id FROM categories WHERE name = 'creative'), true, 2),
  ('uiux', 'UI/UX', (SELECT id FROM categories WHERE name = 'creative'), true, 3),
  ('illustration', 'イラスト', (SELECT id FROM categories WHERE name = 'creative'), false, 4),
  ('video', '動画編集', (SELECT id FROM categories WHERE name = 'creative'), false, 5)
ON CONFLICT (name) DO NOTHING;

-- 音楽
INSERT INTO public.tags (name, display_name, category_id, is_featured, display_order) VALUES
  ('piano', 'ピアノ', (SELECT id FROM categories WHERE name = 'music'), true, 1),
  ('guitar', 'ギター', (SELECT id FROM categories WHERE name = 'music'), true, 2),
  ('dtm', 'DTM', (SELECT id FROM categories WHERE name = 'music'), false, 3),
  ('vocal', 'ボーカル', (SELECT id FROM categories WHERE name = 'music'), false, 4)
ON CONFLICT (name) DO NOTHING;

-- その他
INSERT INTO public.tags (name, display_name, category_id, is_featured, display_order) VALUES
  ('beginner', '初心者向け', (SELECT id FROM categories WHERE name = 'other'), true, 1),
  ('online', 'オンライン対応', (SELECT id FROM categories WHERE name = 'other'), true, 2),
  ('inperson', '対面可能', (SELECT id FROM categories WHERE name = 'other'), false, 3),
  ('yoga', 'ヨガ', (SELECT id FROM categories WHERE name = 'other'), false, 4),
  ('fitness', 'フィットネス', (SELECT id FROM categories WHERE name = 'other'), false, 5),
  ('cooking', '料理', (SELECT id FROM categories WHERE name = 'other'), false, 6)
ON CONFLICT (name) DO NOTHING;

-- ==============================================
-- 6. mentor_spaces テーブル
-- ==============================================
CREATE TABLE IF NOT EXISTS public.mentor_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  
  category_id UUID REFERENCES public.categories(id),
  
  website_url TEXT,
  x_url TEXT,
  instagram_url TEXT,
  
  external_links JSONB DEFAULT '[]',
  
  is_public BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mentor_spaces_user ON public.mentor_spaces(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_spaces_slug ON public.mentor_spaces(slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mentor_spaces_public ON public.mentor_spaces(is_public, category_id) WHERE is_public = true;

-- ==============================================
-- 7. スペース ↔ タグ 中間テーブル
-- ==============================================
CREATE TABLE IF NOT EXISTS public.space_tags (
  space_id UUID REFERENCES public.mentor_spaces(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (space_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_space_tags_tag ON public.space_tags(tag_id);

-- ==============================================
-- 8. カスタムタグ（スペース用）
-- ==============================================
CREATE TABLE IF NOT EXISTS public.custom_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 1,
  promoted_to_tag_id UUID REFERENCES public.tags(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.space_custom_tags (
  space_id UUID REFERENCES public.mentor_spaces(id) ON DELETE CASCADE,
  custom_tag_id UUID REFERENCES public.custom_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (space_id, custom_tag_id)
);

-- ==============================================
-- 9. サブスクにspace_id追加
-- ==============================================
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS space_id UUID REFERENCES public.mentor_spaces(id) ON DELETE SET NULL;

-- ==============================================
-- 10. 運営クーポン管理テーブル
-- ==============================================
CREATE TABLE IF NOT EXISTS public.admin_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  stripe_coupon_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('year_free', 'custom')),
  duration_months INTEGER,
  max_uses INTEGER DEFAULT 1,
  use_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================
-- 11. RLS ポリシー
-- ==============================================

-- tags テーブル
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON public.tags;
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);

-- mentor_spaces テーブル
ALTER TABLE public.mentor_spaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public spaces are viewable by everyone" ON public.mentor_spaces;
DROP POLICY IF EXISTS "Users can view own spaces" ON public.mentor_spaces;
DROP POLICY IF EXISTS "Users can insert own spaces" ON public.mentor_spaces;
DROP POLICY IF EXISTS "Users can update own spaces" ON public.mentor_spaces;
DROP POLICY IF EXISTS "Users can delete own spaces" ON public.mentor_spaces;
CREATE POLICY "Public spaces are viewable by everyone" ON public.mentor_spaces FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own spaces" ON public.mentor_spaces FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own spaces" ON public.mentor_spaces FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own spaces" ON public.mentor_spaces FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own spaces" ON public.mentor_spaces FOR DELETE USING (auth.uid() = user_id);

-- space_tags テーブル
ALTER TABLE public.space_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Space tags are viewable" ON public.space_tags;
DROP POLICY IF EXISTS "Users can manage own space tags" ON public.space_tags;
CREATE POLICY "Space tags are viewable" ON public.space_tags FOR SELECT USING (
  EXISTS (SELECT 1 FROM mentor_spaces WHERE id = space_id AND (is_public = true OR user_id = auth.uid()))
);
CREATE POLICY "Users can manage own space tags" ON public.space_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM mentor_spaces WHERE id = space_id AND user_id = auth.uid())
);

-- admin_coupons テーブル
ALTER TABLE public.admin_coupons ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 12. トリガー
-- ==============================================
DROP TRIGGER IF EXISTS update_mentor_spaces_updated_at ON public.mentor_spaces;
CREATE TRIGGER update_mentor_spaces_updated_at
  BEFORE UPDATE ON public.mentor_spaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

