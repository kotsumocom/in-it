-- ==============================================
-- サブカテゴリ対応 マイグレーション
-- ==============================================

-- 1. parent_id カラム追加
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.categories(id);

-- 2. 「その他」カテゴリ削除
DELETE FROM public.categories WHERE name = 'other';

-- 3. サブカテゴリ挿入
-- IT・テクノロジー配下
INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'backend', 'サーバーサイド', id, 1 FROM public.categories WHERE name = 'programming'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'frontend', 'フロントエンド', id, 2 FROM public.categories WHERE name = 'programming'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'mobile', 'モバイルアプリ', id, 3 FROM public.categories WHERE name = 'programming'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'infrastructure', 'インフラ・クラウド', id, 4 FROM public.categories WHERE name = 'programming'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'ai_ml', 'AI・機械学習', id, 5 FROM public.categories WHERE name = 'programming'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'nocode', 'ノーコード', id, 6 FROM public.categories WHERE name = 'programming'
ON CONFLICT (name) DO NOTHING;

-- ビジネス・キャリア配下
INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'marketing', 'マーケティング', id, 1 FROM public.categories WHERE name = 'business'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'startup', '起業・独立', id, 2 FROM public.categories WHERE name = 'business'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'career', 'キャリア相談', id, 3 FROM public.categories WHERE name = 'business'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'management', 'マネジメント', id, 4 FROM public.categories WHERE name = 'business'
ON CONFLICT (name) DO NOTHING;

-- クリエイティブ配下
INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'design_uiux', 'UI/UXデザイン', id, 1 FROM public.categories WHERE name = 'creative'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'design_graphic', 'グラフィックデザイン', id, 2 FROM public.categories WHERE name = 'creative'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'video', '動画編集', id, 3 FROM public.categories WHERE name = 'creative'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'illustration', 'イラスト', id, 4 FROM public.categories WHERE name = 'creative'
ON CONFLICT (name) DO NOTHING;

-- 語学配下
INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'english', '英語・英会話', id, 1 FROM public.categories WHERE name = 'language'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'chinese', '中国語', id, 2 FROM public.categories WHERE name = 'language'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.categories (name, display_name, parent_id, display_order)
SELECT 'korean', '韓国語', id, 3 FROM public.categories WHERE name = 'language'
ON CONFLICT (name) DO NOTHING;

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
