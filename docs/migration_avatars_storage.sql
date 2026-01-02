-- =============================================
-- プロフィール画像用 Storage バケット
-- =============================================

-- Supabase コンソール > Storage で以下を実行:
-- 1. "avatars" という名前の新しいバケットを作成
-- 2. Public bucket を有効化

-- または SQL で作成:
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS ポリシー（既存削除してから作成）
DROP POLICY IF EXISTS "Public Avatar Access" ON storage.objects;
CREATE POLICY "Public Avatar Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =============================================
-- スペース画像用 Storage バケット
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('spaces', 'spaces', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Space Image Access" ON storage.objects;
CREATE POLICY "Public Space Image Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'spaces');

DROP POLICY IF EXISTS "Users can upload space images" ON storage.objects;
CREATE POLICY "Users can upload space images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'spaces');

DROP POLICY IF EXISTS "Users can update space images" ON storage.objects;
CREATE POLICY "Users can update space images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'spaces');

DROP POLICY IF EXISTS "Users can delete space images" ON storage.objects;
CREATE POLICY "Users can delete space images"
ON storage.objects FOR DELETE
USING (bucket_id = 'spaces');
