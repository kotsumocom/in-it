-- ==============================================
-- フィードバック機能 マイグレーション
-- ==============================================

-- フィードバックテーブル
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  space_id UUID REFERENCES public.mentor_spaces(id) ON DELETE SET NULL,
  page_url TEXT,
  message TEXT NOT NULL,
  category TEXT CHECK (category IN ('bug', 'feature', 'question')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON public.feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created ON public.feedbacks(created_at DESC);

-- RLSポリシー
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- 誰でもフィードバック送信可能
DROP POLICY IF EXISTS "Anyone can insert feedback" ON public.feedbacks;
CREATE POLICY "Anyone can insert feedback" ON public.feedbacks 
  FOR INSERT WITH CHECK (true);

-- 自分のフィードバックは閲覧可能
DROP POLICY IF EXISTS "Users can view own feedback" ON public.feedbacks;
CREATE POLICY "Users can view own feedback" ON public.feedbacks 
  FOR SELECT USING (auth.uid() = user_id);
