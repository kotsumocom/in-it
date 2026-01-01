-- =============================================
-- 通知機能 + カスタムタグテーブル追加
-- =============================================

-- カスタムタグテーブル
CREATE TABLE IF NOT EXISTS public.custom_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  original_name text NOT NULL,
  normalized_name text NOT NULL UNIQUE,
  usage_count integer DEFAULT 1,
  promoted_to_tag_id uuid REFERENCES public.tags(id),
  created_at timestamp with time zone DEFAULT now()
);

-- スペースとカスタムタグの紐付け
CREATE TABLE IF NOT EXISTS public.space_custom_tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id uuid NOT NULL REFERENCES public.mentor_spaces(id) ON DELETE CASCADE,
  custom_tag_id uuid NOT NULL REFERENCES public.custom_tags(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(space_id, custom_tag_id)
);

-- 通知テーブル
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'tag_promoted', 'system', etc.
  title text NOT NULL,
  message text,
  data jsonb, -- 追加データ（タグIDなど）
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_custom_tags_normalized ON public.custom_tags(normalized_name);
CREATE INDEX IF NOT EXISTS idx_custom_tags_usage ON public.custom_tags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- RLS ポリシー
ALTER TABLE public.custom_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_custom_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- カスタムタグは誰でも読める
DROP POLICY IF EXISTS "Custom tags are viewable by everyone" ON public.custom_tags;
CREATE POLICY "Custom tags are viewable by everyone"
  ON public.custom_tags FOR SELECT USING (true);

-- スペースカスタムタグは公開スペース or 自分のスペース
DROP POLICY IF EXISTS "Space custom tags are viewable" ON public.space_custom_tags;
CREATE POLICY "Space custom tags are viewable"
  ON public.space_custom_tags FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.mentor_spaces
      WHERE id = space_id AND (is_public = true OR user_id = auth.uid())
    )
  );

-- 通知は自分のものだけ読める
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
